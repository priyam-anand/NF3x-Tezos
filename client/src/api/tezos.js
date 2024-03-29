import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { setTezos, setAccount, setWallet, setGetters, setMarket } from "../redux/tezosConfigSlick";
import Addresses from "../contracts/Contracts.json";

export const init = async (Tezos, wallet, dispatch) => {
    if (Tezos != undefined && wallet != undefined) {
        return { _tezos: Tezos, _wallet: wallet }
    }
    return new Promise(async (resolve, reject) => {
        try {
            const Tezos = new TezosToolkit("https://jakartanet.tezos.marigold.dev/");
            const wallet = new BeaconWallet({
                name: 'NF3x',
                preferredNetwork: 'jakartanet',
            });
            dispatch(setTezos({ tezos: Tezos }));
            dispatch(setWallet({ wallet: wallet }));
            resolve({ _wallet: wallet, _tezos: Tezos });
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

export const getAccount = async (Tezos, wallet, _account, dispatch) => {
    if (_account != undefined) {
        console.log("predefined account", _account)
        return _account;
    }
    return new Promise(async (resolve, reject) => {
        const activeAccount = await wallet.client.getActiveAccount();
        console.log(activeAccount);
        if (activeAccount) {
            Tezos.setWalletProvider(wallet);
            dispatch(setTezos({ tezos: Tezos }));
            dispatch(setWallet({ wallet: wallet }));
            dispatch(setAccount({ account: activeAccount.address }))
            resolve(activeAccount.address)
        } else {
            try {
                await wallet.client.requestPermissions({
                    network: { type: 'jakartanet' }
                });
                Tezos.setWalletProvider(wallet);
                var account = await wallet.client.getActiveAccount();
                dispatch(setTezos({ tezos: Tezos }));
                dispatch(setWallet({ wallet: wallet }));
                dispatch(setAccount({ account: account.address }))

                resolve(account.address)
            } catch (err) {
                reject(err);
            }
        }
    })
}

export const getGetters = async (Tezos, _getters, dispatch) => {
    if (_getters != undefined)
        return _getters;
    return new Promise(async (resolve, reject) => {
        try {
            const getters = await Tezos.wallet.at(Addresses.Getters);
            dispatch(setGetters({ getters: getters }));
            resolve(getters);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

export const getMarket = async (Tezos, _market, dispatch) => {
    if (_market != undefined)
        return _market;
    return new Promise(async (resolve, reject) => {
        try {
            const market = await Tezos.wallet.at(Addresses.Market);
            dispatch(setMarket({ market: market }));
            resolve(market);
        } catch (e) {

        }
    })
}