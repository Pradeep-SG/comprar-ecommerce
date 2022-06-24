import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createReview = createAsyncThunk(
  'reviewInfo/createReview',
  async (arg, { rejectWithValue, getState }) => {
    const { productId, review } = arg;
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        review,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewInfoSlice = createSlice({
  name: 'reviewInfo',
  initialState: { reviewInfo: {} },
  reducers: {
    resetReviewInfo(state) {
      state.reviewInfo = {};
    },
  },
  extraReducers: {
    [createReview.pending]: (state) => {
      state.reviewInfo = {
        loading: true,
      };
    },
    [createReview.fulfilled]: (state, action) => {
      state.reviewInfo = {
        success: action.payload,
      };
    },
    [createReview.rejected]: (state, action) => {
      state.reviewInfo = {
        error: action.payload,
      };
    },
  },
});

export const { resetReviewInfo } = reviewInfoSlice.actions;

export default reviewInfoSlice.reducer;
