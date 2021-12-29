import { BigNumber as EthersBignumber } from '@ethersproject/bignumber';


export class TestUtils {



  createTxEvent(block: number, attackerAddress: string = 'attacker') : any {
    const mockTxEvent = {
      filterFunction: jest.fn().mockReturnValue([{
        args: {
          spender: attackerAddress,
          addedValue: EthersBignumber.from(5)
        }
      }]),
      blockNumber: block,
      from: "victim",
      to: "tokenAddress"
    } as any;
    return mockTxEvent;
  }
}
