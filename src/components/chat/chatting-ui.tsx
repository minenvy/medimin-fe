import UserAvatar from '@/components/avatar'
import useUser from '@/api/use-user'
import {CloseOutlined} from '@ant-design/icons'
import {Button, Input, Spin} from 'antd'
import {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'

interface IChatProps {
	username: string
	email: string
	image?: string
	messages: Array<IConversation>
	closeChat: Function
	sendMessage: Function
}

interface IConversation {
	email: string
	content: string
}

function ChattingUI(props: IChatProps) {
	const {username, email, image, messages, sendMessage, closeChat} = props
	const {user} = useUser()
	const [message, setMessage] = useState<string>('')
	const [isFetching, setIsFetching] = useState<boolean>(false)
	const lastMessageRef = useRef<HTMLDivElement>(null)

	useEffect(() => scrollToBottom(), [messages.length])

	const scrollToBottom = () => {
		lastMessageRef.current?.scrollIntoView({block: 'end', inline: 'nearest'})
	}
	const handleSendMessage = async (e: any) => {
		e.preventDefault()
		if (isFetching) return
		setIsFetching(true)
		setMessage('')
		await sendMessage(message)
		setIsFetching(false)
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
					onClick={() => closeChat()}
				/>
			</Header>
			<Conversation>
				<Spin spinning={isFetching}>
					{messages.length > 0 ? (
						messages.map((message, id) => {
							const isMyMessage = message.email === user?.email
							const isLastElement = id === messages.length - 1
							return !isMyMessage ? (
								<LeftWrapper
									key={id}
									ref={!isFetching && isLastElement ? lastMessageRef : null}
								>
									<LeftPara>{message.content}</LeftPara>
								</LeftWrapper>
							) : (
								<RightWrapper
									key={id}
									ref={!isFetching && isLastElement ? lastMessageRef : null}
								>
									<RightPara>{message.content}</RightPara>
								</RightWrapper>
							)
						})
					) : (
						<StyledP>Start to chat now</StyledP>
					)}
				</Spin>
			</Conversation>
			<StyledInput
				autoSize
				placeholder="Aa"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onPressEnter={(e) => handleSendMessage(e)}
			/>
		</StyledBoxChat>
	)
}

export default ChattingUI

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
