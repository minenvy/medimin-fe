import {UserOutlined} from '@ant-design/icons'
import {Avatar, Typography} from 'antd'
import styled from 'styled-components'
import {IUserInfo} from '@/App'
import {useNavigate} from 'react-router-dom'
import React from 'react'

interface ICommentProps {
	author: IUserInfo
	description: string
}

const Comment = React.forwardRef((props: ICommentProps, ref: any) => {
	const {author, description} = props
	const navigate = useNavigate()

	const redirectToProfile = () => {
		navigate(`/profile/${author.email}`)
	}

	return (
		<Wrapper ref={ref}>
			<StyledAvatar
				shape="circle"
				icon={<UserOutlined />}
				src={author?.image}
				onClick={redirectToProfile}
			/>
			<CommentLine>
				<TitleComment>
					<Title>{author.username}</Title>
				</TitleComment>
				<Description>{description}</Description>
			</CommentLine>
		</Wrapper>
	)
})

const Wrapper = styled.div`
	display: flex;
	margin-bottom: 10px;
`
const StyledAvatar = styled(Avatar)`
	vertical-align: middle;
	background-color: #1677ff;
	min-width: 32px;
	margin-right: 8px;
	&:hover {
		cursor: pointer;
	}
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
