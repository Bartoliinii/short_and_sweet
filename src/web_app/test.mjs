// Import axios as an ES module
import axios from 'axios';

const apiUrl = 'http://0.0.0.0:7001/get_reviews/';
const app_id = 'com.google.android.apps.maps';
const stars = 1;
const count = 10;

// Specify the parameters for the request
const params = {
  app_id: app_id,
  stars: stars,
  count: count,
};

// Make the GET request to the specified endpoint
axios.get(apiUrl, {
  params: params,
  headers: {
    'Accept': 'application/json',
  },
})
  .then(response => {
    // Handle the response data
    console.log('Response:', response.data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });
