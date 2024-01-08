import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { ReviewsReducer as reviewReducer } from "./slices/reviews.slice";

import { reviewsApi } from "../api/reviews.api";
const rootReducer = combineReducers({
  reviewReducer,
  [reviewsApi.reducerPath]: reviewsApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(reviewsApi.middleware);
    },
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
