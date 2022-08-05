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
                if (isWhitelised(assets[i].token.contract.address) && assets[i].balance > 0)
                    tokens.push(assets[i].token);
            }
            resolve(tokens);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

export const _getTokenMetadata = async (collection, tokenId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const asset = (await axios.get(`https://api.ghostnet.tzkt.io/v1/tokens?contract=${collection}&tokenId=${tokenId}`)).data;
            const metadata = asset[0].metadata;
            resolve(metadata);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

export const _getItem = async (collection, tokenId, getters) => {
    return new Promise(async (resolve, reject) => {
        try {
            const item = await getters.views.getItem(collection, tokenId).read();
            resolve(item);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
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

export const _getOffers = async (getters, token, tokenId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const item = await getters.views.getActiveOffers(token, tokenId).read();
            resolve(item);
        } catch (e) {
            reject(e)
        }
    })
}

export const getImageURI = (uri) => {
    uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    return uri;
}
