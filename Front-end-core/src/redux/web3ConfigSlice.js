import { createSlice } from "@reduxjs/toolkit";
import Addresses from "../contracts/Addresses.json";

const web3ConfigSlice = createSlice({
    name: "web3Config",
    initialState: {
        web3: undefined,
        account: undefined,
        getter: undefined,
        market: undefined,
        nfts: Array.apply(null, Array(Addresses.ERC721.length))
    },
    reducers: {
        setWeb3: (state, action) => {
            const { web3 } = action.payload;
            state.web3 = web3;
        },
        setAccount: (state, action) => {
            const { account } = action.payload;
            state.account = account;
        },
        setGetter: (state, action) => {
            const { getter } = action.payload;
            state.getter = getter;
        },
        setMarket: (state, action) => {
            const { market } = action.payload;
            state.market = market;
        },
        setNFT: (state, action) => {
            const { nft, index } = action.payload;
            const _nfts = state.nfts;
            _nfts[index] = nft;
            state.nfts = _nfts;
        }
    }
});

export const { setWeb3, setAccount, setGetter, setMarket, setNFT } = web3ConfigSlice.actions;
export default web3ConfigSlice.reducer;