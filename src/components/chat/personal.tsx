import UserAvatar from '@/components/avatar'
import useUser from '@/api/use-user'
import {CloseOutlined} from '@ant-design/icons'
import {Button, Input} from 'antd'
import {useEffect, useMemo, useState} from 'react'
import styled from 'styled-components'
import socket from '@/socket'
import {getMessages} from './api'

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
	const {username, email, image, setPersonalChat} = props
	const {user} = useUser()
	const [message, setMessage] = useState<string>('')
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

	const exitPersonalChat = () => {
		setPersonalChat({
			username: '',
			email: '',
			image: '',
		})
	}
	const handleChangeMessage = (e: any) => {
		const newMessage = e.target.value
		if (newMessage.includes('\n')) {
			socket.emit('send message', {
				room: _id,
				senderMail: user?.email,
				receiverMail: email,
				content: newMessage.replace('\n', ''),
			})
			setMessage('')
		} else setMessage(newMessage)
	}

	return (
		<StyledBoxChat>
			<Header>
				<UserAvatar
					username={username}
					image={image}
					email={email}
					canNavigate={false}
				/>
				<Button
					type="text"
					shape="circle"
					icon={<CloseOutlined />}
					onClick={exitPersonalChat}
				/>
			</Header>
			<Conversation>
				{messages.length > 0 ? (
					messages.map((message, id) => {
						const isMyMessage = message.email === user?.email
						return !isMyMessage ? (
							<LeftWrapper key={id}>
								<LeftPara>{message.content}</LeftPara>
							</LeftWrapper>
						) : (
							<RightWrapper key={id}>
								<RightPara>{message.content}</RightPara>
							</RightWrapper>
						)
					})
				) : (
					<StyledP>Start to chat now</StyledP>
				)}
			</Conversation>
			<StyledInput
				autoSize
				placeholder="Aa"
				value={message}
				onChange={handleChangeMessage}
			/>
		</StyledBoxChat>
	)
}

const StyledBoxChat = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
const Conversation = styled.div`
	flex: 1;
	max-height: 27rem;
	overflow: auto;
`
const LeftWrapper = styled.div`
	display: flex;
	justify-content: flex-start;
`
const RightWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
`
const LeftPara = styled.p`
	width: max-content;
	text-align: left;
	padding: 4px 8px;
	border-radius: 12px;
	background-color: rgb(235, 235, 235);
`
const RightPara = styled.p`
	width: max-content;
	text-align: right;
	padding: 4px 8px;
	border-radius: 12px;
	color: white;
	background-color: #1677ff;
`
const StyledP = styled.p`
	text-align: center;
	color: #6b6b6b;
`
const StyledInput = styled(Input.TextArea)`
	border-radius: 20px;
	padding: 6px 10px;
	font-size: 14px;
	line-height: 16px;
	margin-right: 8px;
`

export default PersonalChat
