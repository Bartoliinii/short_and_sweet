import { Container, Text } from "@chakra-ui/react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Comment } from "./Comment";
import { Comment as CommentType } from "../shared/interfaces/Comment.interfaces";

interface ReviewsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setShouldFetchMoreData: (shouldFetchMoreData: boolean) => void
  setTopicId: (topicId: string) => void
  setCurrentReviewType: (currentReviewType: string) => void
  topicId: string;
  shouldFetchMoreData: boolean;
  reviewsData: any
}
export const ReviewsModal = ({
  isOpen,
  setIsOpen,
  setTopicId,
  setShouldFetchMoreData,
  setCurrentReviewType,
  reviewsData
}: ReviewsModalProps) => {

 const onCloseModal = () => {
  setIsOpen(false);
  setShouldFetchMoreData(false);
  setTopicId("");
  setCurrentReviewType("");
};

  return (
    <Modal open={isOpen} onClose={onCloseModal} center>
      <Text paddingBottom={"32px"} fontSize={"24px"} textAlign={"center"}>
        {reviewsData?.cluster}
      </Text>
      <Container>
        {reviewsData?.reviews.map((comment: CommentType, index: number) => {
          return <Comment key={index} comment={comment} />;
        })}
      </Container>
    </Modal>
  );
};

