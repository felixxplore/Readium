'use client'

import { useState, useCallback, useEffect } from 'react'
import { getAllPosts, getMyPosts, getPostById, getPostsByAuthor } from '@/lib/api/posts'
import { likePost, unlikePost } from '@/lib/api/likes'
import type { Article, ArticlePreview } from '@/types'

export function useArticles(page: number = 0, pageSize: number = 10) {
  const [articlePreviews, setArticlePreviews] = useState<ArticlePreview[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      try {
        setIsLoading(true)
        const { posts, totalPages: pages, totalElements: total } = await getAllPosts(page, pageSize)
        if (isMounted) {
          setArticlePreviews(posts)
          setTotalPages(pages)
          setTotalElements(total)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load articles')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadArticles()

    return () => {
      isMounted = false
    }
  }, [page, pageSize])

  const toggleClap = useCallback((articleId: string) => {
    const postId = Number(articleId)
    if (Number.isNaN(postId)) return

    likePost(postId).catch(err => {
      console.error('Failed to like post:', err)
    })

    setArticlePreviews(prev =>
      prev.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            claps: article.claps + 1,
          }
        }
        return article
      })
    )
  }, [])

  const toggleSave = useCallback((articleId: string) => {
    setArticlePreviews(prev =>
      prev.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            isSaved: !article.isSaved,
          }
        }
        return article
      })
    )
  }, [])

  return {
    articlePreviews,
    totalPages,
    totalElements,
    isLoading,
    error,
    toggleClap,
    toggleSave,
  }
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | undefined>()
  const [relatedArticles, setRelatedArticles] = useState<ArticlePreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadArticle = async () => {
      const articleId = Number(slug)
      if (Number.isNaN(articleId)) {
        if (isMounted) {
          setArticle(undefined)
          setRelatedArticles([])
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)
        const post = await getPostById(articleId)

        if (!isMounted) {
          return
        }

        setArticle(post)

        // Load related articles by the same author
        if (post.author.username) {
          const { posts } = await getPostsByAuthor(post.author.username, 0, 3)
          if (isMounted) {
            setRelatedArticles(posts.filter(p => p.id !== slug))
          }
        }

        setError('')
      } catch (err) {
        if (isMounted) {
          setArticle(undefined)
          setRelatedArticles([])
          setError(err instanceof Error ? err.message : 'Unable to load article')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadArticle()

    return () => {
      isMounted = false
    }
  }, [slug])

  const toggleClap = useCallback(async () => {
    if (!article) return

    const postId = Number(article.id)
    if (Number.isNaN(postId)) return

    try {
      if (article.isClapped) {
        await unlikePost(postId)
      } else {
        await likePost(postId)
      }

      setArticle(prev => {
        if (!prev) return prev
        return {
          ...prev,
          isClapped: !prev.isClapped,
          claps: prev.isClapped ? Math.max(0, prev.claps - 1) : prev.claps + 1,
        }
      })
    } catch (err) {
      console.error('Failed to toggle clap:', err)
    }
  }, [article])

  const toggleSave = useCallback(() => {
    setArticle(prev => {
      if (!prev) return prev
      return {
        ...prev,
        isSaved: !prev.isSaved,
      }
    })
  }, [])

  return {
    article,
    isLoading,
    error,
    relatedArticles,
    toggleClap,
    toggleSave,
  }
}

export function useAuthorArticles(username: string, page: number = 0, pageSize: number = 10) {
  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadAuthorArticles = async () => {
      try {
        setIsLoading(true)

        const { posts, totalPages: pages, totalElements: total } = await getPostsByAuthor(username, page, pageSize)

        if (isMounted) {
          setArticles(posts)
          setTotalPages(pages)
          setTotalElements(total)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load author stories')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadAuthorArticles()

    return () => {
      isMounted = false
    }
  }, [username, page, pageSize])

  return {
    articles,
    totalPages,
    totalElements,
    isLoading,
    error,
  }
}

export function useTagArticles(tag: string, page: number = 0, pageSize: number = 10) {
  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // TODO: Implement tag filtering once backend provides it
  // For now, all articles are returned as the backend doesn't have tag filtering

  return {
    articles,
    totalPages,
    totalElements,
    isLoading,
    error,
  }
}

export function useSearch(query: string, page: number = 0, pageSize: number = 10) {
  const [results, setResults] = useState<ArticlePreview[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    let isMounted = true

    const loadSearchResults = async () => {
      try {
        setIsLoading(true)
        const { posts, totalPages: pages, totalElements: total } = await (await import('@/lib/api/posts')).searchPosts(query, page, pageSize)

        if (isMounted) {
          setResults(posts)
          setTotalPages(pages)
          setTotalElements(total)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to search articles')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadSearchResults()

    return () => {
      isMounted = false
    }
  }, [query, page, pageSize])

  return {
    results,
    totalPages,
    totalElements,
    isLoading,
    error,
  }
}
