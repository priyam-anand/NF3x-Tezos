import { configureStore, combineReducers } from "@reduxjs/toolkit";
import popupSlice from "./popupSlice";
import tezosConfigSlice from "./tezosConfigSlick"

const reducer = combineReducers({
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