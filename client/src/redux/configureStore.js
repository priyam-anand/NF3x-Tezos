import { configureStore, combineReducers } from "@reduxjs/toolkit";
import web3ConfigSlice from "./web3ConfigSlice";
import popupSlice from "./popupSlice";
import tezosConfigSlice from "./tezosConfigSlick"

const reducer = combineReducers({
    web3Config: web3ConfigSlice,
    tezosConfig : tezosConfigSlice,
    popupState : popupSlice
});

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

export default store;