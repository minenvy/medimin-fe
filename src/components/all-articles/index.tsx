import Article from '@/components/article'
import {Menu, Typography} from 'antd'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import styled from 'styled-components'
import {IArticle} from '@/api/use-article'
import {ITab} from '@/constants/filter-tags'
import useUser from '@/api/use-user'

interface IArticlesProps {
	articles: Array<IArticle>
	items: Array<ITab>
	setItems: Function
	selectedKey: string
	setSelectedKey: Function
}

function AllArticles(props: IArticlesProps) {
	const {articles, items, setItems, selectedKey, setSelectedKey} = props
	const {email} = useParams()
	const navigate = useNavigate()
	const location = useLocation()
	const {user} = useUser()
	const path = location.pathname.split('/')[1]
	const isInProfile = path.includes('profile')
	const token = localStorage.getItem('token')
	const isLogined = token || false
	let indexOfSelectedKey = 0
	items.forEach((item, index) => {
		if (item?.key === selectedKey) indexOfSelectedKey = index
	})

	let renderedArticles: Array<IArticle> = []
	switch (indexOfSelectedKey) {
		case 0:
			if (!isInProfile) break
			if (email) {
				renderedArticles = articles.filter(
					(article) => article?.author?.email === email
				)
				break
			}
			renderedArticles = articles.filter(
				(article) => article?.author?.email === user?.email
			)
			break
		case 1:
			if (isInProfile) {
				if (email) {
					renderedArticles = articles.filter((article) =>
						article?.favorited.includes(email)
					)
					break
				} else {
					renderedArticles = articles.filter((article) =>
						article?.favorited.includes(user?.email!)
					)
					break
				}
			} else
				renderedArticles = articles.filter(
					(article) => article?.author?.email !== user?.email
				)
			break
		case 2:
			renderedArticles = articles.filter((article) =>
				user?.following
					? user?.following.includes(article?.author?.email)
					: false
			)
			break
		case 3:
			renderedArticles = articles.filter((article) =>
				article?.tagList.includes(selectedKey)
			)
			break
	}

	const handleSelectKey = (item: ITab) => {
		const destination = item?.key
		if (destination === selectedKey) return
		if (destination === 'add') {
			navigate('/editor')
			return
		}

		setSelectedKey(destination)
		const mainTabs = items.slice(0, 3)
		if (mainTabs.find((cur) => cur.key === destination)) setItems(mainTabs)
	}

	return (
		<>
			{isLogined && (
				<StyledMenu
					theme="light"
					mode="horizontal"
					items={items}
					selectedKeys={[selectedKey]}
					onClick={handleSelectKey}
				/>
			)}
			{renderedArticles.length ? (
				renderedArticles.map((article) => {
					const {_id} = article
					return <Article key={_id} {...article} />
				})
			) : (
				<StyledText>No articles are here... yet.</StyledText>
			)}
		</>
	)
}

const StyledMenu = styled(Menu)`
	position: sticky;
	top: 0;
	z-index: 10;
	& .ant-menu-item-icon ~ .ant-menu-title-content {
		display: none;
	}
`
const StyledText = styled(Typography.Text)`
	line-height: 3;
`

export default AllArticles
