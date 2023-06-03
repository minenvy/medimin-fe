import useUser from '@/api/use-user'
import {useEffect, useMemo, useState} from 'react'
import socket from '@/socket'
import {getMessages} from './api'
import ChattingUI from './chatting-ui'

interface IPersonalChatProps {
	username: string
	email: string
	image?: string
	setPersonalChat: Function
}

interface IConversation {
	email: string
	content: string
}

function PersonalChat(props: IPersonalChatProps) {
	const {email, setPersonalChat} = props
	const {user} = useUser()
	const [messages, setMessages] = useState<Array<IConversation>>([])

	const _id = useMemo(() => {
		return [user?.email, email].sort().toString()
	}, [user?.email])

	useEffect(() => {
		;(async () => {
			const data = await getMessages(_id)
			if (data?.messages) setMessages(data?.messages)
		})()
	}, [_id])

	useEffect(() => {
		socket.emit('join room', {room: _id})
	}, [user?.email])

	useEffect(() => {
		socket.on('receive message', (data) => {
			setMessages((preState) => [...preState, data as IConversation])
		})

		return () => {
			socket.off('receive message')
		}
	}, [socket])

	const closeChat = () => {
		setPersonalChat({
			username: '',
			email: '',
		})
	}
	const sendMessage = (content: string) => {
		socket.emit('send message', {
			room: _id,
			senderMail: user?.email,
			receiverMail: email,
			content,
		})
	}

	return (
		<ChattingUI
			{...props}
			messages={messages}
			closeChat={closeChat}
			sendMessage={sendMessage}
		/>
	)
}

export default PersonalChat
