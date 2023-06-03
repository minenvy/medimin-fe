import {Routes, Route} from 'react-router-dom'
import Header from '@/layouts/header'
import Login from '@/pages/login'
import Home from '@/pages/home'
import Editor from '@/pages/editor'
import Settings from '@/pages/settings'
import Profile from '@/pages/profile'
import Article from '@/pages/article'
import ChatButton from '@/components/chat'

export interface IUserInfo {
	username: string | ''
	email: string | ''
	bio?: string
	image?: string
	background?: string
	following?: Array<string>
	chattedWith?: Array<IUserInfo> | []
}

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route path={'/login'} element={<Login />} />
				<Route path={'/register'} element={<Login />} />
				<Route path={'/editor/:_id'} element={<Editor />} />
				<Route path={'/editor'} element={<Editor />} />
				<Route path={'/setting'} element={<Settings />} />
				<Route path={'/profile/:email'} element={<Profile />} />
				<Route path={'/profile'} element={<Profile />} />
				<Route path={'/article/:_id'} element={<Article />} />
				<Route path={'/'} element={<Home />} />
			</Routes>
			<ChatButton />
		</>
	)
}

export default App
