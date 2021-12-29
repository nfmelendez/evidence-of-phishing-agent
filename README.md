# OpenZeppelin UUPSUpgradeable Agent

## Description

This agent detects when the UUPSUpgradeable contract is upgraded and then selfdestructed leaving the contract broken and funds locked.

## Supported Chains

- Ethereum

## Alerts

- OZ-UPGRADE-SELFDESTRUCT-1
  - Fired when the contract is upgraded and selfdestructed. it detects the `Upgraded(address indexed implementation)` event and then checks if the contract was destructed.
  - Severity is always set to "critical" as then the contract is broken because the upgrade behaviour is part of the contract itself
  - Type is always set to "Suspicious" as it may be an attacker or could be the owner destrying the contract.
  - Metadata
    - `from` address that initiated the transaction
    - `contractDestructed` address of the contract destroyed

## More Documentation
  - UUPSUpgradeable Vulnerability Post-mortem : https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680
  
