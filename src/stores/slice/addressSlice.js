import { createSlice } from "@reduxjs/toolkit";
import { fetchMyAddress } from "../action/address";
const addressSlice = createSlice({
    name: "address",
    initialState: {
        isLoading: false,
        isError: false,
        addresses: [],
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchMyAddress.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchMyAddress.fulfilled, (state, action) => {
            state.addresses = action.payload
            state.isLoading = false
            state.isError = false
            return state
        })
        builder.addCase(fetchMyAddress.rejected, (state) => {
            state.isLoading = false
            state.isError = true
            state.brands = []
            return state
        })
    }
})
const addressActions = addressSlice.actions;
const addressReducer = addressSlice.reducer;
export { addressReducer, addressActions }