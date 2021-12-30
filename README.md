# Evidence of Phishing Agent

## Description

This agent alert cases of phishing detecting when several EOA (Externally Owned Address) give permisson to a single EOA to use their funds via approve() or increaseAllowance() ERC20 methods. The agent watch many suspicious activites at the same time and when the suspect match a criteria, it reports the attacker, the victim and the stolen funds with a forta alert


## Supported Chains

- Ethereum

## Alerts

- EVIDENCE-OF-PHISHING-1
  - Fired when there are 10 `approve` or `increaseAllowance` ERC20 calls from different EOA to a single EOA within `1600` blocks since last suspicious activity. EOA addresses that are from known exchanges are excluded.
  - Severity is always set to "critical" as a phishing operation is in pregress and affect all the community
  - Type is always set to "Suspicious" as probably is phishing but could exist a real case where many EOA with permissons to a single EOA
  - Metadata
    - `affectedAddresses` victim affected address in comma separated format 
    - `attackerAddress` address of the attacker
    - `addressesAmount` The token address and amount stolen from the victim in format: `[$token1, $amount1], [$token2, $amount2],...,[$tokenN, $amountN]`
    - `numberofCalls` Number of suspicious method calls (approve or increaseAllowance) detected

## Test Data

The agent behaviour can be verified with the following command:
  1. forta-agent run --range 13650638..13652198
  2. Address `0x1fcdb04d0c5364fbd92c73ca8af9baa72c269107` should be detected as attacker throwing EVIDENCE-OF-PHISHING-1 alert

## More Documentation
  - Badger DAO phishing attack: https://rekt.news/badger-rekt/
  
