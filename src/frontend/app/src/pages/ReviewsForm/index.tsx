import { Box, Button, Flex, Spinner, Text, useToast} from "@chakra-ui/react";

import ReviewForm from "../../components/ReviewForm";
import { useEffect, useState } from "react";
import { AdvancedOptionsCheckbox } from "../../components/AdvancedOptionsCheckbox";
import { useGetAppDataQuery } from "../../app/api/reviews.api";
import { useNavigate } from "react-router-dom";
import { AppRoutePaths } from "../../shared/enums/RoutePaths.enums";

const ReviewsFormPage = () => {
  const [url, setUrl] = useState<string>("");
  const navigate = useNavigate();

  const toast = useToast();
  const [stars, setStars] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [shouldSendRequest, setShouldSendRequest] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const { isLoading, isSuccess, error, isError } = useGetAppDataQuery(
    { url, stars, reviews },
    {
      skip: !shouldSendRequest,
    }
  );

  const handleKeyDown = async () => {
    setShouldSendRequest(true);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(AppRoutePaths.RETRIEVING_REVIEWS);
      setShouldSendRequest(false);
    }

    if (isError) {
      toast({
        //@ts-expect-error
        title: error?.data?.detail || "",
        status: "error",
        duration: 7000,
        isClosable: true,
      });

      setShouldSendRequest(false);
    }
  }, [isSuccess, isError]);

  return (
    <Box>
      {!isLoading ? (
        <Flex
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
          flexDirection={"column"}
        >
          <Box paddingBottom="100px">
            <Text fontSize={"40px"} fontWeight={700} as={"h1"}>
              Short and Sweet
            </Text>
          </Box>
          <ReviewForm setUrl={setUrl} url={url} />
          <AdvancedOptionsCheckbox
            reviews={reviews}
            stars={stars}
            setStars={setStars}
            setReviews={setReviews}
            setHasError={setHasError}
          />
          <Button marginTop={"10px"} onClick={handleKeyDown}>
            Send
          </Button>
        </Flex>
      ) : (
        <Flex gap={'50px'} flexDirection={"column"} alignItems={'center'} height={'100vh'} justifyContent={'center'}>
          <Box>
            <Text fontSize={"40px"} fontWeight={700} as={"h1"}>
              Scrapping App Rewiews
            </Text>
          </Box>
          <Box>
            <Spinner />
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default ReviewsFormPage;
