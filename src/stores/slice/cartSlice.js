import { createSlice } from "@reduxjs/toolkit";
import { fetchCart } from "../action/cart";
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        isLoading: false,
        isError: false,
        carts: [],
    },
    reducers: {
        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.carts.find(item => item.productDetailId === id || item.id === id);
            if (item) {
                item.quantity = quantity;
            } else {
                console.log("Item not found with id:", id); // Debug log
            }
        },
        removeFromCart: (state, action) => {
            state.carts = state.carts.filter(item =>
                item.productDetailId !== action.payload && item.id !== action.payload
            );
        },
        clearCart: (state) => {
            state.carts = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            console.log("Cart fetched successfully:", action.payload);
            state.carts = action.payload
            state.isLoading = false
            state.isError = false
            return state
        })
        builder.addCase(fetchCart.rejected, (state) => {
            state.isLoading = false
            state.isError = true
            state.carts = []
            return state
        })
    }
})
const cartActions = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export { cartReducer, cartActions }