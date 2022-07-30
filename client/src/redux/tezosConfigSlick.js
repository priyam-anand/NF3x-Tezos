import { createSlice } from "@reduxjs/toolkit";

const tezosConfigSlice = createSlice({
    name: "tezosConfig",
    initialState: {
        tezos: undefined,
        wallet: undefined,
        account: undefined,
        getters : undefined,
        market : undefined
    },
    reducers: {
        setTezos: (state, action) => {
            const { tezos } = action.payload;
            state.tezos = tezos;
        },
        setWallet: (state, action) => {
            const { wallet } = action.payload;
            state.wallet = wallet;
        },
        setAccount: (state, action) => {
            const { account } = action.payload;
            state.account = account;
        },
        setGetters: (state, action) => {
            const {getters} = action.payload;
            state.getters = getters;
        },
        setMarket: (state, action) => {
            const {market} = action.payload;
            state.market = market;
        }
    }
});

export const { setTezos, setAccount, setWallet, setGetters, setMarket } = tezosConfigSlice.actions;
export default tezosConfigSlice.reducer;