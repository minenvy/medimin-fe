import {Button, Image, Input, Upload} from 'antd'
import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import useUser from '@/api/use-user'
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface'
import customFetch from '@/api/fetch'

function Settings() {
	const {user, changeUserInfo} = useUser()
	const image = user?.image
	const background = user?.background
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [name, setName] = useState(user?.username)
	const [bio, setBio] = useState(user?.bio)
	const [newPw, setNewPw] = useState('')
	const navigate = useNavigate()
	const isChangeImageInfo = image || background

	useEffect(() => {
		setName(user?.username)
		setBio(user?.bio)
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
		const image =
			fileList[0] && (await getBase64(fileList[0].originFileObj as RcFile))
		const background =
			fileList[1] && (await getBase64(fileList[1].originFileObj as RcFile))

		const fetchData = () => {
			customFetch('/user/change-info', {
				token: localStorage.getItem('token'),
				image,
				background,
				username: name,
				bio,
				newPw,
			})
				.then((res) => res.json())
				.then(async () => {
					await changeUserInfo()
					reset()
					navigate('/')
				})
				.catch((err) => console.log(err))
		}

		fetchData()
	}
	const getBase64 = (file: RcFile): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = (error) => reject(error)
		})
	const changeImage: UploadProps['onChange'] = async ({
		fileList: newFileList,
	}) => {
		setFileList(
			newFileList.map((file) => {
				return {...file, status: 'done'}
			})
		)
	}

	return (
		<Form>
			<CurrentImagesWrapper>
				{image && (
					<div style={{width: '45%'}}>
						<p>Current Avatar:</p>
						<Image
							src={image}
							preview={false}
							alt="avatar"
							width={'200px'}
							height={'200px'}
						/>
					</div>
				)}
				{background && (
					<div style={{width: '45%'}}>
						<p>Current Background:</p>
						<Image
							src={background}
							preview={false}
							alt="background"
							width={'200px'}
							height={'200px'}
						/>
					</div>
				)}
			</CurrentImagesWrapper>
			<Upload
				listType="picture"
				maxCount={2}
				onChange={changeImage}
				onPreview={() => {}}
				fileList={fileList}
				customRequest={() => {}}
			>
				{fileList.length === 0 && (
					<Button>
						Choose&nbsp; {isChangeImageInfo && 'new'} avatar image
					</Button>
				)}
				{fileList.length === 1 && (
					<Button>
						Choose&nbsp; {isChangeImageInfo && 'new'} background image
					</Button>
				)}
			</Upload>
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
`

export default Settings
