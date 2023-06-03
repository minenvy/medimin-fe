import styled from 'styled-components'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import AllArticle from '@/components/all-articles'
import Tags from '@/components/tags'
import {bannerLink} from '@/constants/links'
import {homeTags} from '@/constants/filter-tags'
import useArticles from '@/api/use-articles'

function Home() {
	const navigate = useNavigate()
	const isLogined = localStorage.getItem('token') || false
	const [items, setItems] = useState(homeTags)
	const [selectedKey, setSelectedKey] = useState(
		items.length === 4
			? items[3]?.key
			: items.find((item) => !!item?.label)?.key
	)
	const articles = useArticles()
	let tagsMap = new Map()
	articles &&
		articles.forEach((article) => {
			article?.tagList.forEach((tag) => {
				if (!tagsMap.get(tag)) tagsMap.set(tag, 1)
				else tagsMap.set(tag, tagsMap.get(tag) + 1)
			})
		})
	const tags = new Map(
		[...tagsMap.entries()].sort((a, b) => b[1] - a[1])
	).keys()

	const filterWithTag = (tag: string) => {
		if (!isLogined) {
			navigate('/login')
			return
		}
		setItems((preState) => {
			const tmp = preState.slice(0, 3)
			tmp.push({
				key: tag,
				label: tag,
			})
			return tmp
		})
		setSelectedKey(tag)
	}

	return (
		<>
			{!isLogined && <StyledImage src={bannerLink} alt="bg" />}
			<Wrapper>
				<Content>
					<AllArticle
						articles={articles}
						items={items}
						setItems={setItems}
						selectedKey={selectedKey || ''}
						setSelectedKey={setSelectedKey}
					/>
				</Content>
				<Sider theme="light">
					<Tags tags={Array.from(tags)} filterWithTag={filterWithTag} />
				</Sider>
			</Wrapper>
		</>
	)
}

const StyledImage = styled.img`
	height: 300px;
	width: 100%;
`
const Wrapper = styled.div`
	padding: 24px 10% 0;
	display: flex;
	align-items: flex-start;
	justify-content: space-around;
`
const Content = styled.div`
	width: 55%;
`
const Sider = styled.div`
	width: 25%;
	margin-top: 24px;
	position: sticky;
	top: 0;
	padding-left: clamp(24px, 24px + 100vw - 1080px, 40px);
	border-left: solid 1px rgba(235, 235, 235, 1);
`

export default Home
