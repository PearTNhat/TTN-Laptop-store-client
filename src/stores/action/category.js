import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiGetBrands } from "~/apis/brandApi"

export const fetchCategories = createAsyncThunk(
    'categoy/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetBrands()
            if (response?.code !== 200) {
                throw new Error(response?.message || 'Failed to fetch brands')
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Network error')
        }
    }
)