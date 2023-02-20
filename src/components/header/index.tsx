import {
	FormOutlined,
	HomeOutlined,
	LoginOutlined,
	LogoutOutlined,
	SettingOutlined,
	UserOutlined,
	UserAddOutlined,
} from '@ant-design/icons'
import {Dropdown, Layout, Menu} from 'antd'
import type {MenuProps} from 'antd'
import styled from 'styled-components'
import {useEffect, useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {logoLink} from '@/constants/links'
import UserAvatar from '@/components/avatar'
import {ITab} from '@/constants/filter-tags'
import useUser from '@/api/use-user'
import socket from '@/socket'

const {Header} = Layout

function HeaderC() {
	const {user} = useUser()
	const navigate = useNavigate()
	const location = useLocation()
	const path = location.pathname.split('/')[1]
	const [selectedKey, setSelectedKey] = useState(path === '' ? 'home' : path)
	const isLogined = localStorage.getItem('token') || false

	const menuItems: any = [
		{
			key: 'home',
			label: 'Home',
			icon: <HomeOutlined />,
		},
		!isLogined && {
			key: 'login',
			label: 'Login',
			icon: <LoginOutlined />,
		},
		!isLogined && {
			key: 'register',
			label: 'Register',
			icon: <UserAddOutlined />,
		},
		isLogined && {
			key: 'editor',
			label: 'Write',
			icon: <FormOutlined />,
		},
		isLogined && {
			key: 'settings',
			label: 'Settings',
			icon: <SettingOutlined />,
		},
	].filter((item) => {
		return item
	})

	const items: MenuProps['items'] = [
		{
			key: 'profile',
			label: 'Profile',
			icon: <UserOutlined />,
			onClick: () => navigate('/profile'),
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

	useEffect(() => {
		setSelectedKey(path === '' ? 'home' : path)
	}, [path])

	const handleSelectKey = (item: ITab) => {
		const destination = item.key
		if (destination === selectedKey) return
		setSelectedKey(destination)
		navigate(destination === 'home' ? '/' : `/${destination}`)
	}
	const signOut = () => {
		localStorage.removeItem('token')
		navigate('/')
		if (path === '') window.location.reload()
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
				<StyledMenu
					theme="light"
					mode="horizontal"
					items={menuItems}
					selectedKeys={[selectedKey]}
					onClick={handleSelectKey}
				/>
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
			</Navigation>
		</StyledHeader>
	)
}

const StyledHeader = styled(Header)`
	padding: 10px 10%;
	border-bottom: solid 1px rgba(242, 242, 242, 1);
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const Navigation = styled.div`
	display: flex;
	align-items: center;
`
const StyledMenu = styled(Menu)`
	flex: 1;
	justify-content: flex-end;
	border-bottom: none;
`
const MyDropdown = styled(Dropdown)`
	cursor: pointer;
`

export default HeaderC
