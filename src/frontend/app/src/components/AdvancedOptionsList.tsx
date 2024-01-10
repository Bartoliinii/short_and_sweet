import { FormLabel, Flex, Text, Box } from "@chakra-ui/react";
import { useId, useState } from "react";

interface AdvancedOptionsListProps {
  setHasError: (hasError: boolean) => void;
  setStars: (stars: number) => void;
  setReviews: (reviews: number) => void;
  stars: number;
  reviews: number
}
export const AdvancedOptionsList = ({
  setHasError,
  setStars,
  setReviews,
  stars,
  reviews
}: AdvancedOptionsListProps) => {
  const startCountId = useId();
  const reviewCountId = useId();

  const [error, setError] = useState<string>("");
  const onStarsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = Number(e.target.value);

    setStars(currentValue);
    if (currentValue > 5) {
      setError("Max value is 5");
      setHasError(true);
      return;
    }
  };

  const onReviewsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = Number(e.target.value);

    setReviews(currentValue);
  };
  return (
    <Flex flexDirection={"column"}>
      <FormLabel htmlFor={startCountId}>Stars count: {stars}</FormLabel>
      <input
        onChange={(e) => onStarsCountChange(e)}
        max={5}
        id={startCountId}
		value={stars}
        type="range"
      />
      <Flex justifyContent={"space-between"}>
        <Box>
          <Text>None</Text>
        </Box>
        <Box>
          <Text>5</Text>
        </Box>
      </Flex>
      {error ? <Text color={"red"}>{error}</Text> : null}
      <FormLabel htmlFor={reviewCountId}>Review count: {reviews}</FormLabel>
      <input
        onChange={(e) => onReviewsCountChange(e)}
        id={reviewCountId}
        type="range"
		max={3000}
		min={1400}
		step={200}
		value={reviews}
      />
      <Flex justifyContent={"space-between"}>
        <Box>
          <Text>1400</Text>
        </Box>
        <Box>
          <Text>3000</Text>
        </Box>
      </Flex>
    </Flex>
  );
};
