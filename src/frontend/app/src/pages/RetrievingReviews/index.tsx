import { Box, Flex, Image, Link, Spinner, Text, useToast } from "@chakra-ui/react";
import { useTypedSelector } from "../../shared/hooks/useTypedSelector";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  useGetBertopicQuery,
  useGetDislibertQuery,
  useGetMoreDataQuery,
} from "../../app/api/reviews.api";
import { ReviewsModal } from "../../components/ReviewsModal";
import { AppRoutePaths } from "../../shared/enums/RoutePaths.enums";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const RetrievingReviewsPage = () => {
  const { currentReview } = useTypedSelector((state) => state.reviewReducer);

  const toast = useToast();
  const [shouldFetchBertopicData, setShouldFetchBertopicData] =
    useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentReviewType, setCurrentReviewType] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [shouldFetchMoreData, setShouldFetchMoreData] =
    useState<boolean>(false);

  const {
    refetch: fetchMoreData,
    data: reviewsData,
    isError: isFetchMoreDataError,
    error: fetchMoreDataError,
  } = useGetMoreDataQuery(topicId, {
    skip: !shouldFetchMoreData && topicId === "",
  });

  const {
    data: bertopicData,
    isSuccess: isBertopicRequestSuccess,
    isLoading: isBertopicLoading,
  } = useGetBertopicQuery("");
  const {
    data: dislibertData,
    isSuccess: isDislibertRequestSuccess,
    isLoading: isDislibertLoading,
  } = useGetDislibertQuery("", { skip: !shouldFetchBertopicData });

  useEffect(() => {
    if (currentReviewType) {
      onFindTopicAction();
    }
  }, [currentReviewType]);

  useEffect(() => {
    if (!isBertopicLoading) {
      setShouldFetchBertopicData(true);
    }
  }, [isBertopicLoading]);
  useEffect(() => {
    if (topicId) {
      setShouldFetchMoreData(true);
      setIsOpenModal(true);
    }
  }, [topicId]);

  const onFindTopicAction = () => {
    if (typeof bertopicData?.topics === "object") {
      const topicsKeys = Object.entries(bertopicData.topics);

      topicsKeys.forEach((key) => {
        if (key.includes(currentReviewType)) {
          console.log(topicsKeys, "ke");
          setTopicId(key[0]);
          setShouldFetchMoreData(true);
          setIsOpenModal(true);
        }
      });
    }
  };

  useEffect(() => {
    if (isFetchMoreDataError) {
      toast({
        //@ts-expect-error
        title: fetchMoreDataError?.data?.detail || "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isFetchMoreDataError, toast, fetchMoreDataError]);

  useEffect(() => {
    if (topicId !== "" && shouldFetchMoreData) {
      fetchMoreData();
    }
  }, [topicId, shouldFetchMoreData, fetchMoreData]);

  return (
    <Flex
      justifyContent={"flex-start"}
      flexDirection={"column"}
      alignItems={"center"}
      height={"100vh"}
    >
      <Flex alignItems={"center"} flexDirection={"column"}>
        {isBertopicLoading || isDislibertLoading ? (
          <Text fontSize={"40px"} fontWeight={700} as={"h1"}>
            Running Inference On Review Data
          </Text>
        ) : null}
        <Link
          position={"absolute"}
          left={"20px"}
          fontSize={"24px"}
          href={AppRoutePaths.HOME}
        >
          <ChevronLeftIcon w={24} h={24} />
        </Link>
      </Flex>
      <Flex
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
        marginTop={"100px"}
      >
        <Image
          border={"5px #00000080 solid"}
          borderRadius={"100%"}
          width={100}
          height={100}
          src={currentReview.icon}
          alt={currentReview.title}
        />
        <Text paddingTop={"50px"} fontSize={"40px"} fontWeight={700}>
          {currentReview.title}
        </Text>
      </Flex>
      <Flex>
        <Box>
          {isBertopicLoading ? (
            <Spinner />
          ) : isBertopicRequestSuccess ? (
            // @ts-ignore
            <Plot
              onClick={(e) => {
                // @ts-ignore
                const newReviewType = e.points[0].label as string;
                setCurrentReviewType("");
                setTimeout(() => setCurrentReviewType(newReviewType), 0);
              }}
              data={[
                {
                  x: Object.values(bertopicData?.topics),
                  y: Object.values(bertopicData?.counts),
                  type: "bar",
                  marker: {
                    color: Object.values(bertopicData?.counts).map(
                      (_, i) =>
                        [
                          "#70c1b3",
                          "#f4d35e",
                          "#ee6c4d",
                          "#cfcfcf",
                          "#a1c9f4",
                          "#ffb482",
                          "#d0bbff",
                          "#debb9b",
                          "#fab0e4",
                          "#b9f2f0",
                        ][i % 10]
                    ),
                  },
                  customdata: Object.values(bertopicData?.topics),
                  hovertemplate: "%{customdata}: %{y}<extra></extra>",
                },
                {
                  type: "bar",
                },
              ]}
              layout={{
                width: 600,
                height: 400,
                xaxis: { visible: false },
                yaxis: { title: 'Number of Reviews'}
              }}
              config={{ displayModeBar: false }}
            />
          ) : null}
        </Box>
        <Box>
          {isDislibertLoading ? (
            <Spinner />
          ) : isDislibertRequestSuccess ? (
            <Plot
              data={[
                {
                  labels: Object.keys(dislibertData),
                  values: Object.values(dislibertData),
                  type: "pie",
                  hoverinfo: "label+percent",
                  marker: {
                    colors: Object.keys(dislibertData).map((key) => {
                      switch (key) {
                        case "positive":
                          return "#70c1b3";
                        case "neutral":
                          return "#f4d35e";
                        case "negative":
                          return "#ee6c4d";
                        default:
                          return "#cfcfcf";
                      }
                    }),
                  },
                },
                {
                  type: "pie",
                },
              ]}
              layout={{ width: 600, height: 400 }}
              config={{ displayModeBar: false }}
            />
          ) : null}
        </Box>
      </Flex>

      {isOpenModal ? (
        <ReviewsModal
          setCurrentReviewType={setCurrentReviewType}
          setShouldFetchMoreData={setShouldFetchMoreData}
          setTopicId={setTopicId}
          reviewsData={reviewsData}
          topicId={topicId}
          shouldFetchMoreData={shouldFetchMoreData}
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
        />
      ) : null}
    </Flex>
  );
};

export default RetrievingReviewsPage;
