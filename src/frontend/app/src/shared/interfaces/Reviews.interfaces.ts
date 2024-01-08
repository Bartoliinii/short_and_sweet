export interface ReviewsState {
  currentReview: Review;
  hasError: boolean;
  error: {
    detail: string;
  };
}

export interface Review {
  title: string;
  icon: string;
  reviews: number;
}
