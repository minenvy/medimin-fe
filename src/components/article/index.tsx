import {Tag, Image, Divider, Typography} from 'antd'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import UserAvatar from '@/components/avatar'
import {IArticle} from '@/api/use-article'

function Article(props: IArticle) {
	const {author, title, description, createdAt, updatedAt, tagList, image} =
		props
	const navigate = useNavigate()
	const token = localStorage.getItem('token')
	const isLogined = token || false

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString()
	}
	const handleClick = () => {
		if (!isLogined) navigate('/login')
		else navigate(`/article/${props?._id}`)
	}

	return (
		<>
			<Wrapper onClick={handleClick}>
				<About>
					<UserAvatar
						username={author.username}
						image={author?.image}
						email={author.email}
					/>
					<Title>{title}</Title>
					<Description>{description}</Description>
					<StyledDiv>
						<Typography.Text type="secondary">
							{formatDate(createdAt) || formatDate(updatedAt)}
						</Typography.Text>
						<Tags>
							{tagList.map((tag) => {
								return <Tag key={tag}>{tag}</Tag>
							})}
						</Tags>
					</StyledDiv>
				</About>
				<Image width={120} height={120} src={image} alt="imgage" />
			</Wrapper>
			<Divider />
		</>
	)
}

const StyledDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`
const Wrapper = styled(StyledDiv)`
	padding-top: 24px;
	margin-bottom: 32px;
	cursor: pointer;
`
const About = styled.div`
	flex: 1;
	padding-right: 20px;
`
const Description = styled(Typography.Text)`
	font-size: 16px;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	margin: 12px 60px 12px 0;
`
const Title = styled(Description)`
	font-size: 22px;
	font-weight: 700;
`
const Tags = styled.div`
	font-size: 16px;
	max-width: 50%;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
	& .ant-tag {
		border-radius: 12px;
	}
`

export default Article
