import {Button, Input, Typography} from 'antd'
import {useLocation, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import {useState} from 'react'
import customFetch from '@/api/fetch'

const {Title, Link} = Typography

function Login() {
	const navigate = useNavigate()
	const location = useLocation()
	const isInLogin = location.pathname.toLocaleLowerCase().includes('login')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	// const [isLoading, setIsLoading] = useState(false)

	const handleChangeUsername = (e: any) => {
		setUsername(e.target.value)
	}
	const handleChangeEmail = (e: any) => {
		setEmail(e.target.value)
	}
	const handleChangePassword = (e: any) => {
		setPassword(e.target.value)
	}
	const handleSubmit = () => {
		customFetch(isInLogin ? '/auth/login' : '/auth/register', {
			user: {
				username,
				email,
				password,
			},
		})
			.then((resp) => resp.json())
			.then((res) => {
				if (!res.token) return
				localStorage.setItem('token', res.token)
				navigate('/')
				window.location.reload()
			})
			.catch((err) => console.log(err))
	}

	return (
		<>
			<Form>
				<Title level={1}>{isInLogin ? 'Sign in' : 'Sign up'}</Title>
				<StyledLink href={isInLogin ? '/register' : '/login'}>
					{isInLogin ? 'Need an account?' : 'Have an account?'}
				</StyledLink>
				<Inputs>
					{!isInLogin && (
						<StyledInput
							placeholder="Username"
							value={username}
							onChange={handleChangeUsername}
						/>
					)}
					<StyledInput
						placeholder="Account"
						value={email}
						onChange={handleChangeEmail}
					/>
					<StyledPasswordInput
						placeholder="Password"
						value={password}
						onChange={handleChangePassword}
					/>
					<StyledButton type="primary" size="middle" onClick={handleSubmit}>
						{isInLogin ? 'Sign in' : 'Sign up'}
					</StyledButton>
				</Inputs>
			</Form>
		</>
	)
}

const Form = styled.div`
	max-width: 540px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 24px auto 0;
`
const StyledLink = styled(Link)`
	margin-bottom: 12px;
`
const Inputs = styled.form`
	width: 100%;
`
const StyledInput = styled(Input)`
	font-size: 20px;
	padding: 12px 24px;
	border-radius: 4px;
	margin-bottom: 16px;
`
const StyledPasswordInput = styled(Input.Password)`
	font-size: 20px;
	padding: 12px 24px;
	border-radius: 4px;
	margin-bottom: 16px;
`
const StyledButton = styled(Button)`
	float: right;
	height: 50px;
	padding: 12px 24px;
	font-size: 20px;
	line-height: 20px;
	border-radius: 4px;
`

export default Login
