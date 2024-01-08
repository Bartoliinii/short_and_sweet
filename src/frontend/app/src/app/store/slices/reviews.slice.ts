import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Review,
  ReviewsState,
} from "../../../shared/interfaces/Reviews.interfaces";

const initialState: ReviewsState = {
  currentReview: {} as Review,
  hasError: false,
  error: {
    detail: "",
  },
};

export const ReviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setCurrentReview: (state, action: PayloadAction<Review>) => {
      state.currentReview = action.payload;
    },
    setHasError(state, action: PayloadAction<boolean>) {
      state.hasError = action.payload;
    },

    setError(state, action: PayloadAction<{ detail: string }>) {
      state.error = action.payload;
    },
  },
});

export const ReviewsReducer = ReviewsSlice.reducer;
