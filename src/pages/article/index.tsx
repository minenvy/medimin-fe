import styled from 'styled-components'
import UserAvatar from '@/components/avatar'
import {
	CommentOutlined,
	DeleteOutlined,
	EditOutlined,
	LikeOutlined,
	SendOutlined,
	ShareAltOutlined,
	UserOutlined,
} from '@ant-design/icons'
import {Button, Tooltip, Typography, Image, Input, Avatar} from 'antd'
import {useEffect, useState, useRef} from 'react'
import Comment from '@/components/comment'
import {useParams, useNavigate} from 'react-router-dom'
import useComment, {postComment, IComment} from '@/api/use-comment'
import useArticle, {likeArticle, deleteArticle} from '@/api/use-article'
import useUser from '@/api/use-user'

function Article() {
	const {_id = ''} = useParams()
	const navigate = useNavigate()
	const {user} = useUser()
	const [isLiked, setIsLiked] = useState(false)
	const [comment, setComment] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const {comments, setComments} = useComment(_id)
	const article = useArticle(_id)
	const newCommentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setIsLiked(
			article?.favorited
				? article?.favorited.includes(user?.email || '')
				: false
		)
		// eslint-disable-next-line react-api/exhaustive-deps
	}, [user?.username, article])

	useEffect(() => {
		newCommentRef.current?.scrollIntoView({block: 'end', inline: 'nearest'})
	}, [comments.length])

	const like = () => {
		likeArticle(_id, user?.email || '')
		setIsLiked(!isLiked)
	}
	const wannaComment = () => {
		if (!inputRef.current) return
		inputRef.current.focus()
	}
	const changeComment = (e: any) => {
		const newComment = e.target.value
		if (newComment.includes('\n')) {
			postNewComment()
			return
		} else setComment(newComment)
	}
	const postNewComment = async () => {
		postComment(_id, comment)
		setComments([
			{
				description: comment,
				author: user,
			} as IComment,
			...comments,
		])
		setComment('')
	}
	const editArticle = () => {
		navigate(`/editor/${_id}`)
	}
	const deleteThisArticle = () => {
		deleteArticle(_id)
		navigate('/')
	}

	return (
		<Wrapper>
			<Author>
				<UserAvatar
					username={article?.author.username || ''}
					image={article?.author?.image}
					email={article?.author.email || ''}
				/>
				{article?.author?.email === user?.email && (
					<Icons className="icons">
						<Tooltip title="Edit article">
							<Button
								type="text"
								icon={<EditOutlined />}
								onClick={editArticle}
							></Button>
						</Tooltip>
						<Tooltip title="Delete article">
							<Button
								danger
								type="text"
								icon={<DeleteOutlined />}
								onClick={deleteThisArticle}
							></Button>
						</Tooltip>
					</Icons>
				)}
			</Author>
			<Title>{article?.title}</Title>
			<Description>{article?.description}</Description>
			<Tags>
				{article?.tagList.map((tag) => {
					return (
						<Button type="link" key={tag}>
							{'#' + tag}
						</Button>
					)
				})}
			</Tags>
			<Image width={768} src={article?.image} alt="imgage" />
			<Actions>
				<Button
					type={isLiked ? 'primary' : 'text'}
					icon={<LikeOutlined />}
					onClick={like}
				>
					Like
				</Button>
				<Button type="text" icon={<CommentOutlined />} onClick={wannaComment}>
					Comment
				</Button>
				<Button type="text" icon={<ShareAltOutlined />}>
					Share
				</Button>
			</Actions>
			<MyComment>
				<StyledAvatar
					src={user?.image}
					shape="circle"
					icon={<UserOutlined />}
				/>
				<StyledInput
					autoSize
					placeholder="Write any answers..."
					value={comment}
					onChange={changeComment}
					ref={inputRef}
				/>
				<Button type="text" icon={<SendOutlined />} onClick={postNewComment} />
			</MyComment>
			{comments.map((comment, id) => {
				const isNewComment = id === 0

				return (
					<Comment
						key={id}
						ref={isNewComment ? newCommentRef : null}
						author={comment.author}
						description={comment.description}
					/>
				)
			})}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	max-width: 768px;
	height: calc(100vh - 68px);
	margin: 0 auto;
	background-color: #f6f6f6;
	box-shadow: 1px 2px 2px #d1d1d1, -1px 2px 2px #d1d1d1;
	padding: 0 16px;
	overflow: auto;
	&:hover {
		& .icons {
			visibility: visible;
		}
	}
`
const Author = styled.div`
	padding: 8px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const Icons = styled.div`
	visibility: hidden;
`
const Description = styled(Typography.Text)`
	font-size: 16px;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	margin: 8px 60px 8px 0;
`
const Title = styled(Description)`
	font-size: 22px;
	font-weight: 700;
`
const Tags = styled.div`
	font-size: 16px;
	margin: 4px 0;
	& .ant-btn {
		padding: 0 4px 0 0;
	}
`
const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 0;
	margin-bottom: 8px;
	border-top: 1px solid #d4d4d4;
	border-bottom: 1px solid #d4d4d4;
`
const MyComment = styled.div`
	display: flex;
	margin-bottom: 10px;
`
const StyledAvatar = styled(Avatar)`
	min-width: 32px;
	margin-right: 8px;
	background-color: #1677ff;
`
const StyledInput = styled(Input.TextArea)`
	border-radius: 12px;
	padding: 6px 10px;
	font-size: 14px;
	line-height: 16px;
	margin-right: 8px;
`

export default Article
