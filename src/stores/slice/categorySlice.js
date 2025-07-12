import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "../action/category";
const categorySlice = createSlice({
    name: "category",
    initialState: {
        isLoading: false,
        isError: false,
        categories: [],
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload
            state.isLoading = false
            state.isError = false
            return state
        })
        builder.addCase(fetchCategories.rejected, (state) => {
            state.isLoading = false
            state.isError = true
            state.categories = []
            return state
        })
    }
})
const categoryActions = categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export { categoryReducer, categoryActions }