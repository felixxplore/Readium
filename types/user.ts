export interface User {
  id: string
  username: string
  name: string
  email: string
  avatar: string
  bio: string
  followers: number
  following: number
  articlesCount: number
  createdAt: string
}

export interface UserProfile extends User {
  isFollowing: boolean
  articles: string[]
  savedArticles: string[]
}
