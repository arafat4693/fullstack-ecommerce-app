import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import wishService from '../services/wishService'

const initialState = {
    wishlist: [],
    message: '',
    success: false,
    error: false,
    loading: false
}

//add product in wishlist
export const addInWishlist = createAsyncThunk(
    'wishlist/add',
    async (productId, thunkAPI) => {
        try {
            const userId = thunkAPI.getState().auth.user?._id
            return await wishService.wishlist(`/wishlist/${userId}/${productId}`)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

//all products in wishlist
export const wishProducts = createAsyncThunk(
    'wishlist/get',
    async (_, thunkAPI) => {
        const userId = thunkAPI.getState().auth.user?._id
        return await wishService.wishlist(`/wishlist/${userId}`)
    }
)

const wishSlice = createSlice({
    name: 'wish',
    initialState,
    reducers: {
        resetState: (state) => {
            state.message = ''
            state.success = false
            state.error = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addInWishlist.fulfilled, (state, action) => {
                state.message = 'Successfully added to wishlist'
                state.success = true
                state.wishlist = [...state.wishlist, action.payload]
            })
            .addCase(addInWishlist.rejected, (state, action) => {
                state.message = action.payload
                state.error = true
            })
            .addCase(wishProducts.pending, (state) => {
                state.loading = true
            })
            .addCase(wishProducts.fulfilled, (state, action) => {
                state.loading = false
                state.wishlist = action.payload
            })
    }
})

export const { resetState } = wishSlice.actions
export default wishSlice.reducer