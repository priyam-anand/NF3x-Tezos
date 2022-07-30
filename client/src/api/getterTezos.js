import Addresses from "../contracts/Contracts.json";
import axios from "axios";
import { bytes2Char, char2Bytes } from '@taquito/utils';

const isWhitelised = (address) => {
    for (var i = 0; i < Addresses.NFTs.length; i++) {
        if (Addresses.NFTs[i] == address)
            return true;
    }
    return false;
}


export const _getTokens = async (account) => {
    return new Promise(async (resolve, reject) => {
        try {
            var url = `https://api.ghostnet.tzkt.io/v1/tokens/balances?token.standard=fa2&account=${account}`

            const assets = (await axios.get(url)).data;
            const tokens = [];
            for (var i = 0; i < assets.length; i++) {
                if (isWhitelised(assets[i].token.contract.address))
                    tokens.push(assets[i].token);
            }
            resolve(tokens);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

export const getListedItems = async (getters) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getters.views.getListedItems([['unit']]).read();
            resolve(items);
        } catch (e) {
            reject(e);
        }
    })
}

export const getImageURI = (uri) => {
    uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    return uri;
}