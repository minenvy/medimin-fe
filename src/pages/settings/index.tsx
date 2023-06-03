import {Button, Image, Input, Tooltip} from 'antd'
import {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import useUser from '@/api/use-user'
import customFetch from '@/api/fetch'

function Settings() {
	const {user, changeUserInfo} = useUser()
	const [image, setImage] = useState('')
	const [background, setBackground] = useState('')
	const [name, setName] = useState('')
	const [bio, setBio] = useState('')
	const [newPw, setNewPw] = useState('')
	const navigate = useNavigate()
	const fileRef = useRef<HTMLInputElement>(null)
	const willBeModifiedImageType = useRef<string>('')

	useEffect(() => {
		setImage(user?.image as string)
		setBackground(user?.background as string)
		setName(user?.username as string)
		setBio(user?.bio as string)
	}, [user])

	const changeName = (e: any) => {
		setName(e.target.value)
	}
	const changeBio = (e: any) => {
		setBio(e.target.value)
	}
	const changePw = (e: any) => {
		setNewPw(e.target.value)
	}
	const reset = () => {
		setBio('')
		setName('')
		setNewPw('')
	}
	const submit = async () => {
		const fetchData = () => {
			customFetch('/user/change-info', {
				token: localStorage.getItem('token'),
				image,
				background,
				username: name,
				bio,
				newPw,
			})
				.then(async () => {
					await changeUserInfo()
					reset()
					navigate('/')
				})
				.catch((err) => console.log(err))
		}

		fetchData()
	}
	const getBase64 = (file: File): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = (error) => reject(error)
		})
	const chooseFile = async (e: any) => {
		const base64 = await getBase64(e.target.files[0])
		if (willBeModifiedImageType.current === 'avatar') setImage(base64 as string)
		else setBackground(base64 as string)
	}
	const changeImage = (key: string) => {
		willBeModifiedImageType.current = key
		fileRef.current?.click()
	}

	return (
		<Form>
			<CurrentImagesWrapper>
				{image && (
					<ImageWrapper onClick={() => changeImage('avatar')}>
						<p>Current Avatar:</p>
						<Tooltip title="Press to change" placement="bottomLeft">
							<Image
								src={image}
								preview={false}
								alt="avatar"
								width={'200px'}
								height={'200px'}
							/>
						</Tooltip>
					</ImageWrapper>
				)}
				{background && (
					<ImageWrapper onClick={() => changeImage('background')}>
						<p>Current Background:</p>
						<Tooltip title="Press to change" placement="bottomRight">
							<Image
								src={background}
								preview={false}
								alt="background"
								width={'200px'}
								height={'200px'}
							/>
						</Tooltip>
					</ImageWrapper>
				)}
				<input
					type="file"
					style={{display: 'none'}}
					onChange={chooseFile}
					ref={fileRef}
				/>
			</CurrentImagesWrapper>
			<Description placeholder="Username" value={name} onChange={changeName} />
			<Body
				placeholder="Short bio about you"
				rows={4}
				value={bio}
				onChange={changeBio}
			/>
			<Description disabled placeholder="Email" value={user?.email} />
			<Description
				placeholder="New Password"
				value={newPw}
				onChange={changePw}
			/>
			<StyledButton type="primary" size="middle" onClick={submit}>
				Update Settings
			</StyledButton>
		</Form>
	)
}

const Form = styled.div`
	max-width: 540px;
	margin: 24px auto 0;
`
const CurrentImagesWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 16px;
`
const ImageWrapper = styled.div`
	width: 45%;
	&:hover {
		cursor: pointer;
		opacity: 0.75;
	}
`
const Description = styled(Input)`
	font-size: 16px;
	padding: 8px 12px;
	border-radius: 4px;
	margin: 8px 0;
`
const Body = styled(Input.TextArea)`
	font-size: 16px;
	padding: 8px 12px;
	border-radius: 4px;
	margin: 8px 0;
`
const StyledButton = styled(Button)`
	float: right;
	height: 50px;
	padding: 12px 24px;
	font-size: 20px;
	line-height: 20px;
	border-radius: 4px;
	margin-bottom: 15px;
`

export default Settings
