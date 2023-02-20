import Login from '@/pages/login'
import Home from '@/pages/home'
import Editor from '@/pages/editor'
import Settings from '@/pages/settings'
import Profile from '@/pages/profile'
import Article from '@/pages/article'

const routes = [
	{
		path: '/',
		element: Home,
	},
	{
		path: '/login',
		element: Login,
	},
	{
		path: '/register',
		element: Login,
	},
	{
		path: '/editor/:_id',
		element: Editor,
	},
	{
		path: '/editor',
		element: Editor,
	},
	{
		path: '/settings',
		element: Settings,
	},
	{
		path: '/profile/:email',
		element: Profile,
	},
	{
		path: '/profile',
		element: Profile,
	},
	{
		path: '/article/:_id',
		element: Article,
	},
]

export default routes
