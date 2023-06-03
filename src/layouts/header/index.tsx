import {
	FormOutlined,
	LoginOutlined,
	LogoutOutlined,
	SettingOutlined,
	UserOutlined,
	UserAddOutlined,
	BellOutlined,
} from '@ant-design/icons'
import {Button, Dropdown, Layout} from 'antd'
import type {MenuProps} from 'antd'
import styled from 'styled-components'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {logoLink} from '@/constants/links'
import UserAvatar from '@/components/avatar'
import useUser from '@/api/use-user'
import socket from '@/socket'

interface IMenuItem {
	key: string
	label: string
	icon: JSX.Element
}

function Header() {
	const {user} = useUser()
	const navigate = useNavigate()
	const isLogined = localStorage.getItem('token') || false

	const menuItems: Array<IMenuItem> = isLogined
		? [
				{
					key: 'editor',
					label: 'Write',
					icon: <FormOutlined />,
				},
				{
					key: 'notification',
					label: 'Notifications',
					icon: <BellOutlined />,
				},
		  ]
		: [
				{
					key: 'login',
					label: 'Login',
					icon: <LoginOutlined />,
				},
				{
					key: 'register',
					label: 'Register',
					icon: <UserAddOutlined />,
				},
		  ]

	const items: MenuProps['items'] = [
		{
			key: 'profile',
			label: 'Profile',
			icon: <UserOutlined />,
			onClick: () => navigate('/profile'),
		},
		{
			key: 'settings',
			label: 'Settings',
			icon: <SettingOutlined />,
			onClick: () => navigate('/setting'),
		},
		{
			type: 'divider',
		},
		{
			key: 'sign-out',
			label: 'Sign out',
			icon: <LogoutOutlined />,
			onClick: () => signOut(),
		},
	]

	useEffect(() => {
		socket.emit('connect to server', {email: user?.email})
	}, [user?.email])

	const handleClickMenu = (key: string) => {
		navigate(`/${key}`)
	}
	const signOut = () => {
		localStorage.removeItem('token')
		navigate('/')
	}

	return (
		<StyledHeader>
			<img
				width={45}
				src={logoLink}
				alt="logo"
				onClick={() => navigate('/')}
				style={{cursor: 'pointer'}}
			/>
			<Navigation>
				<>
					{menuItems.map((item: IMenuItem) => {
						return (
							<StyledButton
								key={item.key}
								type="text"
								icon={item.icon}
								block
								onClick={() => handleClickMenu(item.key)}
							>
								{item.label}
							</StyledButton>
						)
					})}
					{isLogined && (
						<MyDropdown menu={{items}} trigger={['click']}>
							<div onClick={(e) => e.preventDefault()}>
								<UserAvatar
									username={user?.username || ''}
									image={user?.image}
									email={user?.email || ''}
									canNavigate={false}
								/>
							</div>
						</MyDropdown>
					)}
				</>
			</Navigation>
		</StyledHeader>
	)
}

const StyledHeader = styled(Layout.Header)`
	padding: 10px 10%;
	border-bottom: solid 1px rgba(235, 235, 235, 1);
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const Navigation = styled.div`
	display: flex;
	align-items: center;
`
const StyledButton = styled(Button)`
	margin: 0 8px;
`
const MyDropdown = styled(Dropdown)`
	cursor: pointer;
`

export default Header
