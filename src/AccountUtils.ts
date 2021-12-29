import { ethers } from 'ethers';
import { getJsonRpcUrl } from 'forta-agent';
import { EMPTY_CODE, EXCHANGES_EOA } from './constants'

export class AccountUtils {

    private provider: ethers.providers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.providers.StaticJsonRpcProvider(getJsonRpcUrl());
    }

    // query the contract code
    // @returns true if address has no code therefore is EOA
    public async isEOAandNotExchange(address: string): Promise<boolean> {
        //TODO: we could add a cache to avoid extra calls in ethers.js
        const contractCode = await this.provider.getCode(address);
        return contractCode == EMPTY_CODE && !EXCHANGES_EOA.includes(address);
    }

}