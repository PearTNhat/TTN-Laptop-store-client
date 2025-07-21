import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiGetMyCart } from "~/apis/cartApi"

export const fetchCart = createAsyncThunk(
    'cart/getCart',
    async ({ accessToken }, { rejectWithValue }) => {
        try {
            const response = await apiGetMyCart({ accessToken })
            if (response?.code !== 200) {
                throw new Error(response?.message || 'Failed to fetch cart')
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Network error')
        }
    }
)