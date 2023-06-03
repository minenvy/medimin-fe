import {useState} from 'react'
import ChattingUI from './chatting-ui'
import {chatWithBot} from './api'
import useUser from '@/api/use-user'
import styled from 'styled-components'

interface IBotChatProps {
	username: string
	email: string
	image?: string
	setPersonalChat: Function
}

interface IConversation {
	email: string
	content: string
}

function ChatWithBot(props: IBotChatProps) {
	const {email, setPersonalChat} = props
	const {user} = useUser()
	const [messages, setMessages] = useState<Array<IConversation>>([])

	const getResponse = async (message: string) => {
		const response = await chatWithBot(message)
		setMessages((preState) => {
			return [
				...preState,
				{
					email,
					content: response,
				},
			]
		})
	}
	const sendMessage = async (message: string) => {
		setMessages((preState) => {
			return [
				...preState,
				{
					email: user?.email!,
					content: message,
				},
			]
		})
		await getResponse(message)
	}
	const closeChat = () => {
		setPersonalChat({
			username: '',
			email: '',
		})
	}

	return (
		<ChattingUI
			{...props}
			messages={messages}
			sendMessage={sendMessage}
			closeChat={closeChat}
		/>
	)
}

const Wrapper = styled.div`
	position: relative;
`
const StyledText = styled.p`
	position: absolute;
	top: 50%;
	left: 50%;
`

export default ChatWithBot
