import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiGetCategories } from "~/apis/categoryApi"

export const fetchCategories = createAsyncThunk(
    'categoy/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetCategories()
            if (response?.code !== 200) {
                throw new Error(response?.message || 'Failed to fetch brands')
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Network error')
        }
    }
)