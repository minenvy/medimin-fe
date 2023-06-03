import { useEffect, useState } from 'react'
import { IUserInfo } from '@/App'
import customFetch from '../fetch'

export interface IComment {
	description: string,
	author: IUserInfo,
}

export default function useComment(_id: string) {
	const [comments, setComments] = useState<Array<IComment>>([])

	useEffect(() => {
		(async () => {
			setComments(await getComments(_id))
		})()
		// eslint-disable-next-line react-api/exhaustive-deps
	}, [])

	return { comments, setComments }
}

export async function getComments(_id: string) {
	try {
		const res = await customFetch('/comment/get-by-id', {
			_id,
		}) as Response
		const data = await res.json()
		return data?.comments
	} catch (err) {
		console.log(err)
	}
}

export async function postComment(_id: string, comment: string) {
	await customFetch(`/comment/add`, {
		_id,
		token: localStorage.getItem('token'),
		description: comment,
	}).catch(err => console.log(err))
}
