import { Box, Flex, Text } from '@chakra-ui/react'
import {Comment as CommentType} from '../shared/interfaces/Comment.interfaces'
import { Sentiment } from './Sentiment'

interface CommentProps {
	comment: CommentType
}
export const Comment = ({comment}: CommentProps) => {

	return (
		<Flex overflowY={'scroll'} flexDirection={'column'} gap={'10px'} borderBottom={'2px solid #ccc'}>
			<Text>{comment.review}</Text>
			<Flex gap={'10px'} justifyContent={'flex-end'}>
				<Box>
					<Text fontSize={"20px"}>{comment.thumbs_up_count} 👍</Text>
				</Box>
				<Box>
					<Sentiment sentiment={comment.sentiment}/>
				</Box>
			</Flex>
		</Flex>
	)
}