import axios from "axios";
import Addresses from "../contracts/Addresses.json";

export const getListedItems = (getter, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getListedItems().call({
                from: account
            });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

export const getMyListedItems = (getter, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getMyListedItems().call({
                from: account
            });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

export const getItemWIthId = (id, getter, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const item = await getter.methods.getItemWithId(id).call({ from: account });
            resolve(item);
        } catch (error) {
            reject(error);
        }
    })
}

export const getUnavailableItems = (getter, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getUnavailableItems().call({ from: account });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

export const getTokenDetails = (offer, getter, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tokenDetails = await getter.methods.getTokenDetails(offer.token_addresses[0], offer.tokenIds[0]).call({ from: account });
            resolve(tokenDetails);
        } catch (error) {
            reject(error);
        }
    })
}

export const getActiveBuyNowPayLaterItems_Seller = (getter, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getActiveBuyNowPayLaterItems_Seller().call({ from: account });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

export const getActiveBuyNowPayLaterItems_Buyer = (getter, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getActiveBuyNowPayLaterItems_Buyer().call({ from: account });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

export const getImageURI = (uri) => {
    uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    return uri;
}

export const getTime = (_expires) => {
    const curr = Math.floor(Date.now() / 1000);
    var diff = _expires - curr;
    const day = Math.floor(diff / 86400);
    diff = diff % 86400;
    const hour = Math.floor(diff / 3600);
    diff = diff % 3600;
    const mins = Math.floor(diff / 60);
    var ret = (day > 0 ? `${day} days ` : '') + (hour > 0 ? `${hour} hr ` : '') + (mins > 0 ? `${mins} mins` : '');
    return ret;
}

const isWhitelised = (address) => {
    for (var i = 0; i < Addresses.ERC721.length; i++) {
        if (Addresses.ERC721[i] == address)
            return true;
    }
    return false;
}

export const _getTokens = (account, setAvailable,) => {
    return new Promise(async (resolve, reject) => {
        // iterate over all the nft contracts and find the NFTs that belong to me
        try {
            var url = `https://testnets-api.opensea.io/api/v1/assets?owner=${account}&offset=0&limit=50`;

            const assets = (await axios.get(url)).data.assets;
            const tokens = [];
            for (var i = 0; i < assets.length; i++) {
                if (!isWhitelised(assets[i].asset_contract.address))
                    continue;
                tokens.push(assets[i]);
            }
            setAvailable(tokens);
            resolve();
        } catch (err) {
            reject(err);
        }
    })
}

export const _getToken = (token, tokenId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = (await axios.get(`https://testnets-api.opensea.io/api/v1/asset/${token}/${tokenId}`)).data;
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

export const getItemWithOwer = (items, nfts) => {
    var _items = [...items];
    return new Promise(async (resolve, reject) => {
        try {
            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < nfts.length; j++) {
                    if (items[i].token.toLowerCase() == nfts[j]._address.toLowerCase()) {
                        const _owner = await nfts[j].methods.ownerOf(items[i].tokenId).call();
                        _items[i] = { ...items[i], owner: _owner.toLowerCase() }
                        break;
                    }
                }
            }
            resolve(_items);
        } catch (error) {
            reject(error);
        }
    })
}

export const _getRejectedDirectSale = (account, getter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getRejectedDirectSaleOffers().call({ from: account });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

export const _getRejectedBnpl = (account, getter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getRejectedBuyNowPayLaterOffer().call({ from: account });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

export const _getRejectedSwap = (account, getter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const items = await getter.methods.getRejectedSwapOffer().call({ from: account });
            resolve(items);
        } catch (error) {
            reject(error);
        }
    })
}

