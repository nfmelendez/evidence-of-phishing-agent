import { BigNumber as EthersBignumber } from '@ethersproject/bignumber';


export class TestUtils {


  //crete a transaction mocking the filterFunction
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
      to: "tokenAddress",
      hash: `hash${block}`,
      status : true
    } as any;
    return mockTxEvent;
  }
}
