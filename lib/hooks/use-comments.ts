'use client'

import { useState, useCallback } from 'react'
import { getCommentsByArticleId } from '@/lib/data/fake-comments'
import { currentUser } from '@/lib/data/fake-users'
import type { Comment, CommentReply } from '@/types'

export function useComments(articleId: string) {
  const [comments, setComments] = useState<Comment[]>(() => getCommentsByArticleId(articleId))
  const [isLoading] = useState(false)

  const addComment = useCallback((content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      articleId,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      content,
      likes: 0,
      isLiked: false,
      replies: [],
      createdAt: new Date().toISOString(),
    }
    setComments(prev => [newComment, ...prev])
  }, [articleId])

  const addReply = useCallback((commentId: string, content: string) => {
    const newReply: CommentReply = {
      id: `reply-${Date.now()}`,
      commentId,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      content,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    }
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        }
      }
      return comment
    }))
  }, [])

  const toggleLike = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        }
      }
      return comment
    }))
  }, [])

  return {
    comments,
    isLoading,
    addComment,
    addReply,
    toggleLike,
  }
}
