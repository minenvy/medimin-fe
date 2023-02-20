import {Input, Typography} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import styled from 'styled-components'
import UserAvatar from '@/components/avatar'
import useDebounce from '@/api/use-debounce'
import {domain} from '@/constants/links'
import {IUserInfo} from '@/App'
import useUser from '@/api/use-user'
import customFetch from '@/api/fetch'

interface IChatHome {
	setPersonalChat: Function
	notification: any
	setNotification: Function
}

function ChatHome(props: IChatHome) {
	const {setPersonalChat, notification, setNotification} = props
	const {user, changeUserInfo} = useUser()
	const [messenger, setMessenger] = useState<string>('')
	const debouncedMessenger = useDebounce(messenger)
	const [foundMessengers, setFoundMessengers] = useState<Array<IUserInfo>>([])
	const chattedWith: Array<IUserInfo> = user?.chattedWith || []
	const messengers: Array<IUserInfo> = messenger ? foundMessengers : chattedWith

	useEffect(() => {
		customFetch('/user/get-by-name', {
			name: messenger,
		})
			.then((res) => res.json())
			.then((data) =>
				setFoundMessengers(
					data.filter((friend: any) => friend?.email !== user?.email)
				)
			)
			.catch((err) => console.log(err))
		// eslint-disable-next-line react-api/exhaustive-deps
	}, [debouncedMessenger])

	const chatWithPerson = (user: IUserInfo) => {
		setNotification((preState: Array<string>) =>
			preState.filter((email) => email !== user.email)
		)
		setPersonalChat(user)

		customFetch('/user/change-info', {
			token: localStorage.getItem('token'),
			chattedPerson: user.email,
		})
			.then((res) => res.json())
			.then(() => {
				changeUserInfo()
			})
			.catch((err) => console.log(err))
	}

	return (
		<StyledBoxChat>
			<Typography.Title level={3} style={{margin: 0}}>
				Chats
			</Typography.Title>
			<StyledInput
				placeholder="Search Messenger..."
				prefix={<SearchOutlined />}
				value={messenger}
				onChange={(e) => setMessenger(e.target.value)}
			/>
			{messengers.length > 0 &&
				messengers.map((user) => {
					const {username, image, email} = user
					const hasNotification = notification.includes(email)

					return (
						<AvatarWrapper key={email} onClick={() => chatWithPerson(user)}>
							<UserAvatar
								username={username}
								image={image}
								email={email}
								canNavigate={false}
								bold={hasNotification}
							/>
						</AvatarWrapper>
					)
				})}
			{!messenger && chattedWith.length === 0 && (
				<StyledP>
					You haven't chatted with other people yet.
					<br />
					Search messenger to start new conversation.
				</StyledP>
			)}
			{messenger && messengers.length === 0 && (
				<StyledP>No user found!</StyledP>
			)}
		</StyledBoxChat>
	)
}

const StyledBoxChat = styled.div`
	position: fixed;
	inset-inline-end: 44px;
	inset-block-end: 70px;
	width: 22rem;
	height: 30rem;
	background-color: rgb(250, 250, 250);
	border-radius: 4px;
	box-shadow: 1px 1px 5px #ddd, -1px 1px 5px #ddd;
	padding: 8px;
	z-index: 90;
`
const StyledInput = styled(Input)`
	margin-top: 8px;
	border-radius: 20px;
`
const AvatarWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 12px;
	padding: 6px;
	border-radius: 4px;
	&:hover {
		background-color: rgb(240, 240, 240);
	}
`
const StyledP = styled.p`
	text-align: center;
	color: #6b6b6b;
`

export default ChatHome
