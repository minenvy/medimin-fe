import {FloatButton} from 'antd'
import {CloseOutlined, CommentOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import ChatHome from './home'
import PersonalChat from './personal'
import socket from '@/socket'
import styled from 'styled-components'

interface IPersonalChat {
	username: string
	email: string
	image?: string
}

function ChatButton() {
	const token = localStorage.getItem('token')
	const isLogined = token || false
	const [isChatting, setIsChatting] = useState(false)
	const [personalChat, setPersonalChat] = useState<IPersonalChat>({
		username: '',
		email: '',
		image: '',
	})
	const [count, setCount] = useState(0)
	const [notification, setNotification] = useState<Array<string>>([])

	useEffect(() => {
		socket.on('have notification', (data) => {
			const senderMail = data.senderMail
			if (!notification.includes(senderMail))
				setNotification([...notification, senderMail])

			if (!!!isChatting) {
				setCount((preState) => preState + 1)
			} else setCount(0)
		})
	}, [socket, isChatting])

	useEffect(() => {
		if (isChatting) setCount(0)
	}, [isChatting, socket])

	if (!isLogined) return null

	return (
		<>
			{!!count && <Badge>{count}</Badge>}
			<FloatButton
				icon={isChatting ? <CloseOutlined /> : <CommentOutlined />}
				onClick={() => setIsChatting(!isChatting)}
			/>
			{isChatting ? (
				!personalChat.email ? (
					<ChatHome
						setPersonalChat={setPersonalChat}
						notification={notification}
						setNotification={setNotification}
					/>
				) : (
					<PersonalChat {...personalChat} setPersonalChat={setPersonalChat} />
				)
			) : null}
		</>
	)
}

const Badge = styled.span`
	position: fixed;
	inset-inline-end: 24px;
	inset-block-end: 76px;
	font-size: 14px;
	color: white;
	background-color: red;
	padding: 2px 6px;
	border-radius: 50%;
	z-index: 100;
`

export default ChatButton
