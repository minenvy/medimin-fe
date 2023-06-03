import { useEffect, useState } from 'react'
import { IUserInfo } from '@/App'
import customFetch from '@/api/fetch'

export interface IArticle {
	_id: string
	title: string
	description: string
	createdAt: Date
	updatedAt: Date
	tagList: Array<string>
	favorited: Array<string>
	image: string
	author: IUserInfo
}

export default function useArticle(_id?: string) {
	const [article, setArticle] = useState<IArticle>()

	useEffect(() => {
		(async () => {
			if (!_id) return
			setArticle(await getArticle(_id))
		})()
		// eslint-disable-next-line react-api/exhaustive-deps
	}, [])

	return article
}
export async function getArticle(_id: string) {
	try {
		const res = await customFetch('/article/get-by-id', { _id }) as Response
		const data = await res.json()
		return data
	} catch (err) {
		console.log(err)
	}
}
export async function deleteArticle(_id: string) {
	try {
		await customFetch(`/article/delete`, { _id })
	} catch (err) {
		console.log(err)
	}
}
export async function likeArticle(_id: string, email: string) {
	try {
		await customFetch(`/article/like`, {
			_id,
			email,
		})
	} catch (err) {
		console.log(err)
	}
}
