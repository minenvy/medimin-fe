import {UserOutlined} from '@ant-design/icons'
import {Avatar, Button, Typography} from 'antd'
import AllArticles from '@/components/all-articles'
import styled from 'styled-components'
import {useNavigate, useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {profileTags} from '@/constants/filter-tags'
import useArticles, {follow} from '@/api/use-articles'
import useUser from '@/api/use-user'
import {IUserInfo} from '@/App'

function Profile() {
	const navigate = useNavigate()
	const {email = ''} = useParams()
	const [items, setItems] = useState(profileTags)
	const [friend, setFriend] = useState<IUserInfo>()
	const [selectedKey, setSelectedKey] = useState(
		items.find((item) => !!item?.label)?.key
	)
	const {user, getUser, changeUserInfo} = useUser()
	const articles = useArticles()
	const [isFollowed, setIsFollowed] = useState(false)

	useEffect(() => {
		;(async () => {
			setFriend(await getUser(email))
		})()
		setIsFollowed(
			user?.following ? user.following.includes(friend?.email!) : false
		)
		// eslint-disable-next-line react-api/exhaustive-deps
	}, [email, user?.following])

	const handleClickEdit = () => {
		navigate('/settings')
	}
	const handleClickFollow = async () => {
		const message = await follow(user?.email!, email)
		if (message === 'follow') {
			changeUserInfo()
			setIsFollowed(true)
		} else {
			changeUserInfo()
			setIsFollowed(false)
		}
	}

	return (
		<>
			<Banner url={user?.background}>
				<Wrapper>
					<StyledAvatar
						shape="circle"
						size={100}
						icon={<UserOutlined />}
						src={friend?.image}
					>
						M
					</StyledAvatar>
					<Title>{friend?.username}</Title>
					<Bio>{friend?.bio}</Bio>
					{friend?.email === user?.email ? (
						<StyledButton onClick={handleClickEdit}>
							Edit profile settings
						</StyledButton>
					) : (
						<StyledButton onClick={handleClickFollow}>
							{isFollowed ? 'unfollow' : 'follow'}
						</StyledButton>
					)}
				</Wrapper>
			</Banner>
			<ArticleWrapper>
				<AllArticles
					articles={articles}
					items={items}
					setItems={setItems}
					selectedKey={selectedKey || ''}
					setSelectedKey={setSelectedKey}
				/>
			</ArticleWrapper>
		</>
	)
}

const Banner = styled.div.attrs((props: {url: string}) => ({
	url:
		props.url ||
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRisv-yQgXGrto6OxQxX62JyvyQGvRsQQ760g&usqp=CAU',
}))`
	min-height: 40vh;
	background-image: url(${(props) => props.url});
	background-repeat: no-repeat;
	background-size: cover;
	position: relative;
`
const Wrapper = styled.div`
	max-width: 920px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 32px 0 16px 0;
	margin: 0 auto;
`
const StyledAvatar = styled(Avatar)`
	vertical-align: middle;
	background-color: #1677ff;
	margin-bottom: 16px;
`
const Title = styled(Typography.Text)`
	font-size: 24px;
	font-weight: 700;
	line-height: 18px;
	margin-bottom: 8px;
	text-align: center;
`
const Bio = styled(Typography.Text)`
	font-weight: 300;
	max-width: 450px;
	text-align: center;
	margin-bottom: 8px;
`
const StyledButton = styled(Button)`
	float: right;
	border: 1px solid black;
	padding: 4px 8px;
	font-size: 14px;
	border-radius: 3px;
	background-color: transparent;
	line-height: 20px;
	align-self: flex-end;
	position: absolute;
	bottom: 20px;
`
const ArticleWrapper = styled.div`
	padding: 0 20%;
	margin-top: 24px;
`

export default Profile
