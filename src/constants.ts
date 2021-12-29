export const APPROVAL_FUNCTIONS = [
    "function increaseAllowance(address spender, uint256 addedValue) public returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];

// 0x represents a contract without code
export const EMPTY_CODE = "0x";

export const FXT_EXCHANGE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2";

// list of known exchanges EOAs
export const EXCHANGES_EOA = [FXT_EXCHANGE] 

// Max block to watch a suspect since last suspicious call
export const MAX_BLOCK_TO_TRACK = 1600;

// max call that transform a suspect to an attacker. The calls can be either approve() or increaseAllowance()
export const MAX_CALLS_TO_BE_SUSPICIOUS = 10;

// alert id
export const EVIDENCE_OF_PHISHING_1_ALERTID = "EVIDENCE-OF-PHISHING-1";

// protocol is ERC20 as we watch attackers use 2 erc20 methods for phishing
export const PROTOCOL = 'ERC20';