export interface ITab {
  key: string
  icon?: string
  label?: string
}

export const homeTags: Array<ITab> = [
  {
    key: 'add',
    icon: '+',
  },
  {
    key: 'for-you',
    label: 'For you',
  },
  {
    key: 'following',
    label: 'Following',
  },
]

export const profileTags: Array<ITab> = [
  {
    key: 'my-articles',
    label: 'My articles',
  },
  {
    key: 'favorited-articles',
    label: 'Favorited articles',
  },
]