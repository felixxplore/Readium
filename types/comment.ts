import type { User } from './user'

export interface Comment {
  id: string
  articleId: string
  author: Pick<User, 'id' | 'username' | 'name' | 'avatar'>
  content: string
  likes: number
  isLiked: boolean
  replies: CommentReply[]
  createdAt: string
}

export interface CommentReply {
  id: string
  commentId: string
  author: Pick<User, 'id' | 'username' | 'name' | 'avatar'>
  content: string
  likes: number
  isLiked: boolean
  createdAt: string
}
