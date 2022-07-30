import { getWeb3, switchNetwork } from "../utils";
import { setWeb3, setAccount, setGetter, setMarket, setNFT } from "../redux/web3ConfigSlice";
import Getters from "../contracts/Getters.json";
import Market from "../contracts/Market.json";
import Addresses from "../contracts/Addresses.json";
import ERC721 from "../contracts/ERC721.json";

export const fetchWeb3 = (_web3, dispatch) => {
    if (_web3 != undefined) {
        return _web3
    }
    return new Promise(async (resolve, reject) => {
        try {
            const web3 = await getWeb3();
            dispatch(setWeb3({ web3: web3 }))
            resolve(web3);
        } catch (error) {
            reject(error);
        }
    })
};

export const fetchAccount = (_web3, _account, dispatch) => {
    if (_account != undefined) {
        return _account;
    }
    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await _web3.eth.getAccounts();
            dispatch(setAccount({ account: accounts[0].toLowerCase() }));
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const setNetwork = (_web3) => {
    return new Promise(async (resolve, reject) => {
        try {
            const networkId = await _web3.eth.net.getId();
            if (networkId == 4)
                resolve();
            await switchNetwork(_web3);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const fetchGetter = (_web3, _getter, dispatch) => {
    if (_getter != undefined)
        return _getter;
    return new Promise(async (resolve, reject) => {
        try {
            const getter = new _web3.eth.Contract(
                Getters.abi,
                Addresses.Getters
            );
            dispatch(setGetter({ getter: getter }));
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const fetchMarket = (_web3, _market, dispatch) => {
    if (_market != undefined)
        return _market;
    return new Promise(async (resolve, reject) => {
        try {
            const market = new _web3.eth.Contract(
                Market.abi,
                Addresses.Market
            );
            dispatch(setMarket({ market: market }));
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const fetchNFTs = (_web3, dispatch) => {
    return new Promise((resolve, reject) => {
        try {
            for (let i = 0; i < Addresses.ERC721.length; i++) {
                const _nft = new _web3.eth.Contract(
                    ERC721.abi,
                    Addresses.ERC721[i]
                );
                dispatch(setNFT({ nft: _nft, index: i }));
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    })

}


