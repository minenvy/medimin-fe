import { useState, useEffect } from 'react'
import { IUserInfo } from '@/App'
import customFetch from '../fetch'

export default function useUser() {
	const [user, setUser] = useState<IUserInfo>()

	useEffect(() => {
		(async () => {
			const data = await getUser()
			setUser(data)
		})()
	}, [])

	async function getUser(email?: string) {
		const token = localStorage.getItem('token')
		if (!token) return

		try {
			const res = await customFetch('/user/get', {
				token,
				authorEmail: email,
			})
			const data = await res.json()
			return data
		} catch (err) {
			console.log(err)
		}
	}

	const changeUserInfo = async () => {
		setUser(await getUser())
	}

	return { user, getUser, changeUserInfo }
}
