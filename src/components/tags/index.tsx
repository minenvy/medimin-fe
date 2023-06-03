import {Typography, Button, Space} from 'antd'
import styled from 'styled-components'

interface ITags {
	tags: Array<string>
	filterWithTag: Function
}

function Tags(props: ITags) {
	const {tags, filterWithTag} = props

	const filter = (tag: string) => {
		filterWithTag(tag)
	}

	return (
		<Wrapper>
			<Typography.Text strong>Recommended Topics</Typography.Text>
			<Space size={[8, 8]} wrap>
				{tags.slice(0, 10).map((tag) => {
					return (
						<StyledButton key={tag} onClick={() => filter(tag)}>
							{tag}
						</StyledButton>
					)
				})}
			</Space>
		</Wrapper>
	)
}
const Wrapper = styled.div`
	border-bottom: 1px solid rgba(235, 235, 235, 1);
	padding-bottom: 24px;
	& .ant-space {
		margin-top: 20px;
	}
`
const StyledButton = styled(Button)`
	border: 1px solid rgba(230, 230, 230, 1);
	padding: 8px 16px;
	border-radius: 100px;
	background-color: rgba(242, 242, 242, 1);
	color: rgba(41, 41, 41, 1);
	text-transform: capitalize;
	line-height: 14px;
`

export default Tags
