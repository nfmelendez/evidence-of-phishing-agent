import { ethers } from 'ethers';
import { getJsonRpcUrl } from 'forta-agent';
import { EMPTY_CODE, DISALLOW_ADDRESS_LIST } from './constants'

export class AccountUtils {

    // ethers.js provider
    private provider: ethers.providers.JsonRpcProvider;
    //cache
    private isEOAandNotExchangeResultCache: Map<string, boolean>

    constructor() {
        this.provider = new ethers.providers.StaticJsonRpcProvider(getJsonRpcUrl());
        this.isEOAandNotExchangeResultCache = new Map<string, boolean>();
    }

    // Check if the address is an EOA and is not part of a allow list of known EOA of exchanges.
    // It uses a cache intented to avoid extra calls to the blockchain
    // @returns true if is a valid EOA address
    public async isEOAandNotExchange(address: string): Promise<boolean> {
        //Use a cache to avoid extra calls to the blackchain and checks
        if (this.isEOAandNotExchangeResultCache.has(address)) {
            return this.isEOAandNotExchangeResultCache.get(address) as boolean
        } else {
            const contractCode = await this.provider.getCode(address);
            const result = contractCode == EMPTY_CODE && !DISALLOW_ADDRESS_LIST.includes(address)
            this.isEOAandNotExchangeResultCache.set(address, result)
            return result
        }

    }

}