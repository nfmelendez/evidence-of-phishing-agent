import { 
  Finding, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType 
} from 'forta-agent'

import BigNumber from 'bignumber.js';

import { APPROVAL_FUNCTIONS,
  EVIDENCE_OF_PHISHING_1_ALERTID,
  PROTOCOL
 } from './constants'

import { AccountUtils } from './AccountUtils';
import { SuspectWatcher } from './suspectWatcher';


const accountUtils = new AccountUtils();
const suspectWatcherImpl = new SuspectWatcher();

function provideHandleTransaction(accountUtils: AccountUtils, suspectWatcher: SuspectWatcher) {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings: Finding[] = []

    //process only successful transaction that did process approve or increaseAllowance methods
    if (!txEvent.status) {
      //console.log(`Don't process as thx ${txEvent.hash} is not successful`)
      return findings;
    }

    const approvalFunctionCalls = txEvent.filterFunction(
      APPROVAL_FUNCTIONS
    );
    for (const aApprovalFunctionCall of approvalFunctionCalls) {
      const possibleAttacker = aApprovalFunctionCall.args.spender as string
      let amount : BigNumber
      // check if arg addedValue exists is from increaseAllowance
      if(aApprovalFunctionCall.args.addedValue) {
        amount = new BigNumber(aApprovalFunctionCall.args.addedValue.toBigInt())
      // check if arg amount exists is from approve
      } else if (aApprovalFunctionCall.args.amount) {
        amount = new BigNumber(aApprovalFunctionCall.args.amount.toBigInt())
      } else {
        throw new Error('Something is wrong with the function filtered')
      }
      const possibleVictim = txEvent.from
      const tokenAddress = txEvent.to as string
      // check if address are EOA and not from a kwnow exchange
      const addressesAreEOA = (
        await Promise.all([
          accountUtils.isEOAandNotExchange(possibleVictim),
          accountUtils.isEOAandNotExchange(possibleAttacker),
        ])
      ).reduce( (acc, addressResult) => acc && addressResult)

      if (addressesAreEOA) {
        const suspectDetails = suspectWatcher.processApproveCall(possibleAttacker, possibleVictim, tokenAddress, amount, txEvent.blockNumber, txEvent.hash)
        // we found that actually the suspect is an attacker, create the alert
        if (suspectDetails) {
          findings.push(
            Finding.fromObject({
              alertId: EVIDENCE_OF_PHISHING_1_ALERTID,
              name: `Evidence of phishing detected, attacker address ${suspectDetails.attackerAddress}`,
              description: `There are several calls to increaseAllowance() and approve() to a suspicios attacker EOA ${suspectDetails.attackerAddress}, number of tokens: ${ Array.from(suspectDetails.tokenAmounts.keys()).length}`,
              severity: FindingSeverity.Critical,
              type: FindingType.Suspicious,
              protocol : PROTOCOL,
              metadata: {
                affectedAddresses: suspectDetails.addresses.join(),
                attackerAddress: suspectDetails.attackerAddress,
                addressesAmount : suspectDetails.toStringTokenAmounts(),
                numberofCalls: String(suspectDetails.callCounter)
              },
            })
        );
      }
    }
  }
    return findings
}
}

export default {
  provideHandleTransaction,
  handleTransaction : provideHandleTransaction(accountUtils, suspectWatcherImpl),
}