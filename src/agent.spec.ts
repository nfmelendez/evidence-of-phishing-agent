
import {
  FindingType,
  FindingSeverity,
  Finding,
} from "forta-agent"
import agent from "./agent"

import { MAX_BLOCK_TO_TRACK,
  EVIDENCE_OF_PHISHING_1_ALERTID,
  PROTOCOL
 } from './constants'
 
 import { TestUtils } from './testUtils'


 import { SuspectWatcher } from './suspectWatcher';


const utils = new TestUtils();

describe("Evidence of phishing agent", () => {

  const mockAccountUtils = {
    isEOAandNotExchange : jest.fn(),
  } as any

  beforeEach(() => {
    mockAccountUtils.isEOAandNotExchange.mockReset();
  });


  describe("handleTransaction", () => {
    it("returns a finding as 10 thx has suspect behaviour", async () => {
      const approveCounterImpl = new SuspectWatcher();

      mockAccountUtils.isEOAandNotExchange.mockReturnValue(true)
      const handleTransaction = agent.provideHandleTransaction(mockAccountUtils, approveCounterImpl)

      let findings
      for (var i = 0; i < 10; i++) {
        const mockTxEvent = utils.createTxEvent(i + 1)
        findings = await handleTransaction(mockTxEvent)
      }

      expect(mockAccountUtils.isEOAandNotExchange.mock.calls.length).toBe(20);

      expect(findings).toStrictEqual([Finding.fromObject({
        alertId: EVIDENCE_OF_PHISHING_1_ALERTID,
        name: 'Evidence of phishing detected, attacker address attacker',
        description: 'There are several calls to increaseAllowance() and approve() to a suspicios attacker EOA attacker, number of tokens: 1',
        severity: FindingSeverity.Critical,
        type: FindingType.Suspicious,
        protocol : PROTOCOL,
        metadata: {
          affectedAddresses: "victim,victim,victim,victim,victim,victim,victim,victim,victim,victim",
          attackerAddress: "attacker",
          addressesAmount : "[tokenAddress,50],",
          numberofCalls: "10"
        },
      })])
    })

    it("returns no finding as is tracking a suspect but then time expires", async () => {
      const approveCounterImpl = new SuspectWatcher();

      mockAccountUtils.isEOAandNotExchange.mockReturnValue(true)

      const handleTransaction = agent.provideHandleTransaction(mockAccountUtils, approveCounterImpl)

      let findings
      for (var i = 0; i < 9; i++) {
        const mockTxEvent = utils.createTxEvent(i + 1)
        findings = await handleTransaction(mockTxEvent)
      }

      const mockTxEvent = utils.createTxEvent(10 + MAX_BLOCK_TO_TRACK)
      findings = await handleTransaction(mockTxEvent)

      expect(mockAccountUtils.isEOAandNotExchange.mock.calls.length).toBe(20);

      expect(findings).toStrictEqual([])
    })


  })
})
