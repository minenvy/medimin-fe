import {UserOutlined} from '@ant-design/icons'
import {Avatar, Typography} from 'antd'
import styled from 'styled-components'
import {IUserInfo} from '@/App'

interface ICommentProps {
	author: IUserInfo
	description: string
}

function Comment(props: ICommentProps) {
	const {author, description} = props

	return (
		<Wrapper>
			<StyledAvatar
				shape="circle"
				icon={<UserOutlined />}
				src={author?.image}
			/>
			<CommentLine>
				<TitleComment>
					<Title>{author.username}</Title>
				</TitleComment>
				<Description>{description}</Description>
			</CommentLine>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	margin-bottom: 10px;
`
const StyledAvatar = styled(Avatar)`
	vertical-align: middle;
	background-color: #1677ff;
	min-width: 32px;
	margin-right: 8px;
`
const CommentLine = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8px;
	border-radius: 12px;
	border: 1px solid #ededed;
	background-color: #fafafa;
`
const TitleComment = styled.div`
	display: flex;
	justify-content: space-between;
	& span {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		&:hover {
			cursor: pointer;
		}
	}
`
const Description = styled(Typography.Text)`
	font-size: 15px;
	line-height: 20px;
`
const Title = styled(Description)`
	font-size: 13px;
	font-weight: 700;
`

export default Comment
