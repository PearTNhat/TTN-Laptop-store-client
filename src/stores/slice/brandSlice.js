import { createSlice } from "@reduxjs/toolkit";
import { fetchBrands } from "../action/brand";
const brandSlice = createSlice({
    name: "brand",
    initialState: {
        isLoading: false,
        isError: false,
        brands: [],
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchBrands.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchBrands.fulfilled, (state, action) => {
            state.brands = action.payload
            state.isLoading = false
            state.isError = false
            return state
        })
        builder.addCase(fetchBrands.rejected, (state) => {
            state.isLoading = false
            state.isError = true
            state.brands = []
            return state
        })
    }
})
const brandActions = brandSlice.actions;
const brandReducer = brandSlice.reducer;
export { brandReducer, brandActions }