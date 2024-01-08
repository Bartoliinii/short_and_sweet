import { ChakraProvider } from "@chakra-ui/react";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ReviewsFormPage from "./pages/ReviewsForm";
import RetrievingReviewsPage from "./pages/RetrievingReviews";
import { AppRoutePaths } from "./shared/enums/RoutePaths.enums";

const App = () => {
  return (
    <Router>
      <ChakraProvider>
        <Routes>
          <Route path={AppRoutePaths.HOME} element={<ReviewsFormPage />} />
		  <Route path={AppRoutePaths.RETRIEVING_REVIEWS} element={<RetrievingReviewsPage />} />
        </Routes>
      </ChakraProvider>
    </Router>
  );
};

export default App;
