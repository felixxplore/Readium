'use client'

import { useState, useCallback, useEffect } from 'react'
import { addCommentToPost, addReplyToComment, getCommentsOfPost } from '@/lib/api/posts'
import { likeComment, unlikeComment } from '@/lib/api/likes'
import { useAppSelector } from '@/lib/store/hooks'
import type { Comment } from '@/types'

export function useComments(articleId: string, page: number = 0, pageSize: number = 20) {
  const { user } = useAppSelector(state => state.auth)
  const [comments, setComments] = useState<Comment[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadComments = async () => {
      const postId = Number(articleId)
      if (Number.isNaN(postId)) {
        if (isMounted) {
          setComments([])
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)
        const { comments: items, totalPages: pages, totalElements: total } = await getCommentsOfPost(postId, page, pageSize)
        if (isMounted) {
          setComments(items)
          setTotalPages(pages)
          setTotalElements(total)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load comments')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadComments()

    return () => {
      isMounted = false
    }
  }, [articleId, page, pageSize])

  const addComment = useCallback(async (content: string) => {
    const postId = Number(articleId)
    if (Number.isNaN(postId)) {
      return
    }

    try {
      const newComment = await addCommentToPost(postId, content)
      setComments(prev => [newComment, ...prev])
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add comment')
      throw err
    }
  }, [articleId])

  const addReply = useCallback(async (commentId: string, content: string) => {
    const parsedCommentId = Number(commentId)
    if (Number.isNaN(parsedCommentId) || !user) {
      return
    }

    try {
      const replyFromApi = await addReplyToComment(parsedCommentId, content, articleId)

      setComments(prev =>
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, replyFromApi],
            }
          }
          return comment
        })
      )
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add reply')
      throw err
    }
  }, [articleId, user])

  const toggleLike = useCallback(async (commentId: string) => {
    const parsedCommentId = Number(commentId)
    if (Number.isNaN(parsedCommentId)) {
      return
    }

    try {
      const comment = comments.find(c => c.id === commentId)
      if (comment?.isLiked) {
        await unlikeComment(parsedCommentId)
      } else {
        await likeComment(parsedCommentId)
      }

      setComments(prev =>
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          }
          return comment
        })
      )
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }, [comments])

  return {
    comments,
    totalPages,
    totalElements,
    isLoading,
    error,
    addComment,
    addReply,
    toggleLike,
  }
}
