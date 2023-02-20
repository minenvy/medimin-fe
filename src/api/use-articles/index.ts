import { useEffect, useState } from 'react'
import { IArticle } from '../use-article'
import customFetch from '../fetch'

export default function useArticles() {
	const [articles, setArticles] = useState<Array<IArticle>>([])

	useEffect(() => {
		(async () => {
			const data = await getArticles()
			setArticles(data?.articles)
		})()
	}, [])

	return articles
}

export async function getArticles() {
	try {
		const res = await customFetch('/article/get')
		const data = await res.json()
		return data
	} catch (err) {
		console.log(err)
	}
}

export async function follow(followingEmail: string, followedEmail: string) {
	try {
		const res = await customFetch('/user/follow', {
			followingEmail,
			followedEmail,
		})
		const data = await res.json()
		return data?.message
	} catch (err) {
		console.log(err)
	}
}
