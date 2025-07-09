import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiFetchMyInfo } from "~/apis/userApi"

export const fetchCurrentUser = createAsyncThunk(
    'current-user/getUser',
    async ({ accessToken }, { rejectWithValue }) => {
        try {
            const response = await apiFetchMyInfo({ accessToken })
            if (!response?.success) {
                return rejectWithValue(response?.message || 'Failed to fetch user')
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Network error')
        }
    }
)