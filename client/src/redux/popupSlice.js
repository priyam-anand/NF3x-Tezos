import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: "popupState",
    initialState: {
        loading: false
    },
    reducers: {
        setLoading: (state, action) => {
            const { loading } = action.payload;
            state.loading = loading;
        }
    }
});

export const { setLoading } = popupSlice.actions;
export default popupSlice.reducer;