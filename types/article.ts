import type { User } from './user'

export interface Article {
  id: string
  slug: string
  title: string
  subtitle: string
  content: string
  excerpt: string
  coverImage: string
  author: User
  tags: string[]
  readTime: number
  claps: number
  commentsCount: number
  isSaved: boolean
  isClapped: boolean
  createdAt: string
  updatedAt: string
}

export interface ArticlePreview {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  coverImage: string
  author: Pick<User, 'id' | 'username' | 'name' | 'avatar'>
  tags: string[]
  readTime: number
  claps: number
  commentsCount: number
  isSaved: boolean
  createdAt: string
}

export interface ArticleDraft {
  id?: string
  title: string
  subtitle: string
  content: string
  coverImage: string
  tags: string[]
}
