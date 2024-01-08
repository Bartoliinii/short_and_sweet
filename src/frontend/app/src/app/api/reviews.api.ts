import { HttpMethods } from "../../shared/enums/HttpMethods";
import { ReviewsSlice } from "../store/slices/reviews.slice";

import { baseApi } from "./base.api";

const { setCurrentReview, setError, setHasError } = ReviewsSlice.actions;

const {
  VITE_GET_APP_DATA_URL,
  VITE_GET_BERTOPIC_URL,
  VITE_GET_DISLIBERT,
  VITE_GET_MORE_DATA,
} = import.meta.env;
export const reviewsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAppData: builder.query({
      query: (params: { url: string; stars?: number; reviews?: number }) => ({
        url:
          VITE_GET_APP_DATA_URL +
          `?url=${encodeURIComponent(params.url)}${
            params.stars !== 0 ? `&stars=${params.stars}` : ""
          }${params.reviews ? `&reviews=${params.reviews}` : ""}`,
        method: HttpMethods.GET,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentReview(data));
        } catch (err) {
          if (err instanceof Error) {
            console.log(err.message, "err.message");
            dispatch(setHasError(true));
            dispatch(setError({ detail: err.message }));
            throw new Error(err.message);
          }
        }
      },
    }),
    getBertopic: builder.query({
      query: () => ({
        url: VITE_GET_BERTOPIC_URL || "",
        method: HttpMethods.GET,
      }),
    }),
    getDislibert: builder.query({
      query: () => ({
        url: VITE_GET_DISLIBERT || "",
        method: HttpMethods.GET,
      }),
    }),

    getMoreData: builder.query({
      query: (topicId: string) => ({
        url: VITE_GET_MORE_DATA + `?cluster=${topicId}`,
        method: HttpMethods.GET,
      }),
    }),
  }),
});

export const {
  useGetAppDataQuery,
  useGetBertopicQuery,
  useGetDislibertQuery,
  useGetMoreDataQuery,
} = reviewsApi;
