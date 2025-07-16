import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiGetBrands } from "~/apis/brandApi"

export const fetchBrands = createAsyncThunk(
    'brand/getBrand',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetBrands()
            if (response?.code !== 200) {
                throw new Error(response?.message || 'Failed to fetch categories')
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Network error')
        }
    }
)