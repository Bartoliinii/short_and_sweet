import { Box, Text } from "@chakra-ui/react";


interface SentimentProps {
	sentiment: -1 | 0 | 1;
}
export const Sentiment = ({ sentiment }: SentimentProps) => {
	return (
		<>
			{sentiment === -1 ? (
				<Text fontSize={"20px"}>🙁</Text>
			) : sentiment === 0 ? (
				<Text fontSize={"20px"}>😐</Text>
			) : (
				<Text fontSize={"20px"}>😃</Text>
			)}
		</>
	);
};
