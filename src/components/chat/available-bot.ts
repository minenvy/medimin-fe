import { logoLink } from '@/constants/links'

interface IFriend {
  username: string
  image: string
  email: string
}

export const availableFriends: Array<IFriend> = [
  {
    username: 'Medimin',
    email: 'Medimin',
    image: logoLink,
  },
]