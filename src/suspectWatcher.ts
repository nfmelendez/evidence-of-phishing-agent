import BigNumber from "bignumber.js";

import { 
    MAX_BLOCK_TO_TRACK,
    MAX_CALLS_TO_BE_SUSPICIOUS
   } from './constants'

// The data need to track a suspect
export class SuspectWatcherDetails {
   public expireBlock: number = 0
   public callCounter: number = 0
   public addresses: string[] = []
   public tokenAmounts: Map<string, BigNumber> = new Map()
   public attackerAddress: string = ''

   // transforms to string  the token addresses and amounts to the format: `[$token1, $amount1], [$token2, $amount2], ...`
   public toStringTokenAmounts(): string {
    let result = ''
    this.tokenAmounts.forEach((amount: BigNumber, addr: string) => {
        result += `[${addr},${amount}],`
    });
    return result
   }
}

// watch and process calls of the suspects
export class SuspectWatcher {

    private suspectWatcherTable: Map<string, SuspectWatcherDetails>

    constructor() {
      this.suspectWatcherTable = new Map<string, SuspectWatcherDetails>()
    }

    public processApproveCall(possibleAttacker: string, possibleVictim: string, tokenAddress: string,  amount: BigNumber, blockNumber: number, thxId:string) : SuspectWatcherDetails | undefined {

      // we refresh and clean up the suspects that after some period didn't have activity
      this.deleteExpired(blockNumber)

      let watcherDetails; 
      if (this.suspectWatcherTable.has(possibleAttacker)) { 
        watcherDetails = this.suspectWatcherTable.get(possibleAttacker) as SuspectWatcherDetails
      } else { 
        watcherDetails = new SuspectWatcherDetails()
        this.suspectWatcherTable.set(possibleAttacker, watcherDetails)
      }
      
      // since there is a new operation from the suspect we update the time to expire the watcher
      watcherDetails.expireBlock = blockNumber + MAX_BLOCK_TO_TRACK
      watcherDetails.callCounter++
      watcherDetails.addresses.push(possibleVictim)
      const tokenAmounts = watcherDetails.tokenAmounts;
      if (tokenAmounts.has(tokenAddress)) { 
        const totalAmount = tokenAmounts.get(tokenAddress)?.plus(amount) as BigNumber
        tokenAmounts.set(tokenAddress, totalAmount)
      } else {
        tokenAmounts.set(tokenAddress, amount) 
      }

      watcherDetails.attackerAddress = possibleAttacker

      console.log(`call found attacker ${possibleAttacker} and victim ${possibleVictim} nCall: ${watcherDetails.callCounter} thx ${thxId}`)

      if (watcherDetails.callCounter >= MAX_CALLS_TO_BE_SUSPICIOUS) {
          return watcherDetails;
      }
    }

    // Clean up suspect that didn't have activity in a period of time.
    private deleteExpired(blockNumber: number) {
        const entriesToDelete :string[] = []
        this.suspectWatcherTable.forEach((ad: SuspectWatcherDetails, key: string) => {
            if (blockNumber >= ad.expireBlock) {
                entriesToDelete.push(key)
            }
        });
        entriesToDelete.forEach( e => {
            this.suspectWatcherTable.delete(e)
            console.log(`Suspect deleted: ${e}`)
        })
    }


}