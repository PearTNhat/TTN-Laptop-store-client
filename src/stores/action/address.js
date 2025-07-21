import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiGetMyAddresss } from "~/apis/addressApi"

export const fetchMyAddress = createAsyncThunk(
    'brand/getAddress',
    async ({ accessToken }, { rejectWithValue }) => {
        try {
            const response = await apiGetMyAddresss({ accessToken })
            if (response?.code !== 200) {
                throw new Error(response?.message || 'Failed to fetch categories')
            }
            return response.data
        } catch (error) {
            console.error("Failed to fetch addresses", error);
            return rejectWithValue(error.message || 'Network error')
        }
    }
)