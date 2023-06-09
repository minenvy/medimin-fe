import styled from 'styled-components'
import {Avatar, Typography} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'

interface IAvatarProps {
	username: string
	email: string
	image?: string
	canNavigate?: boolean
	bold?: boolean
}

function UserAvatar(props: IAvatarProps) {
	const navigate = useNavigate()
	const {username, email, image = '', canNavigate = true, bold = false} = props

	const toProfile = () => {
		if (canNavigate) navigate(`/profile/${email}`)
	}

	return (
		<Wrapper onClick={toProfile}>
			<StyledAvatar
				shape="circle"
				icon={<UserOutlined />}
				src={image ? image : null}
			/>
			<UserName strong={bold}>{username}</UserName>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	min-width: 125px;
	z-index: 100;
	cursor: pointer;
`
const StyledAvatar = styled(Avatar)`
	vertical-align: middle;
	background-color: #1677ff;
	min-width: 32px;
`
const UserName = styled(Typography.Text)`
	vertical-align: middle;
	margin-left: 12px;
`

export default UserAvatar
