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
            var url = `https://api.jakartanet.tzkt.io/v1/tokens/balances?token.standard=fa2&account=${account}`
            const assets = (await axios.get(url)).data;
            const tokens = [];
            for (var i = 0; i < assets.length; i++) {
                if (isWhitelised(assets[i].token.contract.address) && assets[i].balance > 0 && assets[i].token.metadata != undefined)
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
            const asset = (await axios.get(`https://api.jakartanet.tzkt.io/v1/tokens?contract=${collection}&tokenId=${tokenId}`)).data;
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

export const getReserved = (getters) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getters.views.getReservedItems([['unit']]).read();
            resolve(items);
        } catch (error) {
            reject(error)
        }
    })
}

export const getReservationData = async (tokenId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = (await axios.get(`https://api.jakartanet.tzkt.io/v1/bigmaps/69159/keys/${tokenId}`)).data.value;
            resolve(data);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}


export const getPositionTokens = async (account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assets = (await axios.get(`https://api.jakartanet.tzkt.io/v1/tokens/balances?token.contract=${Addresses.PositionToken}&account=${account}`)).data;
            const tokens = [];
            for (var i = 0; i < assets.length; i++) {
                if (assets[i].balance > 0)
                    tokens.push(assets[i].token);
            }
            resolve(tokens);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

export const getOffers = async (token, tokenId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const offers = (await axios.get(`https://api.jakartanet.tzkt.io/v1/bigmaps/69165/keys/${token}`)).data.value;
            if (offers == undefined) {
                resolve(null)
                return;
            }
            var _offers = offers[tokenId];
            if (_offers == undefined)
                _offers = null;
            resolve(_offers);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

export const getTime = (timeStamp) => {
    const time = getTimeStamp(timeStamp);
    var diff = time - Date.now() / 1000;
    const day = Math.floor(diff / 86400);
    diff = diff % 86400;
    const hour = Math.floor(diff / 3600);
    diff = diff % 3600;
    const mins = Math.floor(diff / 60);
    var ret = (day > 0 ? `${day} days ` : '') + (hour > 0 ? `${hour} hours ` : '') + (mins > 0 ? `${mins} mins` : '');
    return ret;
}

export const getTimeStamp = (time) => {
    var timeStamp = (new Date(time)).getTime()
    timeStamp /= 1000;
    return timeStamp;
}

export const _getRejectedSwapOffers = async (getters, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const offers = await getters.views.getRejectedSwapOffers(account).read();
            resolve(offers)
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

export const _getRejectedReserveOffers = async (getters, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const offers = await getters.views.getRejectedReserveOffers(account).read();
            resolve(offers);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
