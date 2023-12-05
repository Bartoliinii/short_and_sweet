import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ReviewFetcherProps {
  appId: string;
}

const ReviewFetcher: React.FC<ReviewFetcherProps> = ({ appId }) => {
  const [reviews, setReviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Ensure appId is not empty before making the request
        if (appId) {
          const response = await axios.get(`http://0.0.0.0:7001/get_reviews/?app_id=${appId}`);

          if (response.status === 200) {
            setReviews(response.data.reviews);
          } else {
            console.error('Error fetching reviews:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    // Call the function to fetch reviews
    fetchReviews();
  }, [appId]);

  return (
    <div>
      <h2>Reviews for App ID: {appId}</h2>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>{review}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewFetcher;