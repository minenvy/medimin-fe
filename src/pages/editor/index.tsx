import {Input, Button, Tag, Upload, message} from 'antd'
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import styled from 'styled-components'
import {getArticle} from '@/api/use-article'
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface'
import customFetch from '@/api/fetch'

function Editor() {
	const params = useParams()
	const _id = params?._id || ''
	const navigate = useNavigate()
	const token = localStorage.getItem('token')
	const [title, setTitle] = useState<string>('')
	const [link, setLink] = useState<string>('')
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [body, setBody] = useState<string>('')
	const [tag, setTag] = useState<string>('')
	const [tags, setTags] = useState<Array<string>>([])

	useEffect(() => {
		const fetchArticleData = async () => {
			const article = await getArticle(_id)
			if (Object.keys(article).length) {
				setTitle(article?.title)
				setLink(article?.image)
				setBody(article?.description)
				setTags(article?.tagList)
			}
		}
		fetchArticleData()
		// eslint-disable-next-line react-api/exhaustive-deps
	}, [])

	const changeTitle = (e: any) => {
		setTitle(e.target.value)
	}
	const changeBody = (e: any) => {
		setBody(e.target.value)
	}
	const changeTag = (e: any) => {
		setTag(e.target.value)
	}
	const addTag = (e: any) => {
		if (e.key !== 'Enter') return
		setTags([...tags, tag] as Array<string>)
		setTag('')
	}
	const handleSubmit = async () => {
		await customFetch(`/article/${_id ? 'update' : 'add'}`, {
			title,
			description: body,
			image: link,
			tagList: tags,
			token,
			_id,
		}).catch((err) => console.log(err))
		navigate('/profile')
	}
	const handleClose = (removedTag: string) => {
		setTags((currentTags) => {
			return currentTags.filter((tag) => tag !== removedTag)
		})
	}
	const getBase64 = (file: RcFile): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = (error) => reject(error)
		})
	const beforeUpload = (file: RcFile) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!')
		}
		const isLt2M = file.size / 1024 / 1024 < 2
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!')
		}
		return isJpgOrPng && isLt2M
	}
	const changeImage: UploadProps['onChange'] = async ({
		fileList: newFileList,
	}) => {
		const file = newFileList[0]
		if (!file) return

		file.status = 'done'
		file.preview = await getBase64(file.originFileObj as RcFile)

		setFileList([file])
		setLink(file.preview as string)
	}

	return (
		<Form>
			<Title placeholder="Article Title" value={title} onChange={changeTitle} />
			<Body
				placeholder="Write your article"
				rows={4}
				value={body}
				onChange={changeBody}
			/>
			<Description
				placeholder="Enter tags"
				value={tag}
				onChange={changeTag}
				onKeyDown={addTag}
			/>
			{tags.map((tag) => {
				return (
					<Tag key={tag} closable onClose={() => handleClose(tag)}>
						{tag}
					</Tag>
				)
			})}
			<Upload
				listType="picture"
				maxCount={1}
				beforeUpload={beforeUpload}
				onChange={changeImage}
				onRemove={() => {
					setLink('')
					setFileList([])
				}}
				fileList={fileList}
				customRequest={() => {}}
			>
				{!link && <Button>Choose image</Button>}
			</Upload>
			<StyledButton type="primary" size="middle" onClick={handleSubmit}>
				Publish Article
			</StyledButton>
		</Form>
	)
}

const Form = styled.div`
	max-width: 920px;
	margin: 24px auto 0;
	& .ant-upload-wrapper {
		display: block;
		margin-top: 10px;
	}
`
const Title = styled(Input)`
	font-size: 20px;
	padding: 12px 24px;
	border-radius: 4px;
	margin-bottom: 16px;
`
const Description = styled(Input)`
	font-size: 16px;
	padding: 8px 12px;
	border-radius: 4px;
	margin-bottom: 16px;
`
const Body = styled(Input.TextArea)`
	font-size: 16px;
	padding: 8px 12px;
	border-radius: 4px;
	margin-bottom: 16px;
`
const StyledButton = styled(Button)`
	margin-top: 20px;
	float: right;
	height: 50px;
	padding: 12px 24px;
	font-size: 20px;
	line-height: 20px;
	border-radius: 4px;
`

export default Editor
