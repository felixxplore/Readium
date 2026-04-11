'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  fakeArticles, 
  getArticleBySlug, 
  getArticlesByAuthor, 
  getArticlesByTag,
  searchArticles,
  getArticlePreview 
} from '@/lib/data/fake-articles'
import type { Article, ArticlePreview } from '@/types'

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(fakeArticles)

  const articlePreviews = useMemo(() => 
    articles.map(getArticlePreview),
    [articles]
  )

  const toggleClap = useCallback((articleId: string) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        return {
          ...article,
          isClapped: !article.isClapped,
          claps: article.isClapped ? article.claps - 1 : article.claps + 1,
        }
      }
      return article
    }))
  }, [])

  const toggleSave = useCallback((articleId: string) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        return {
          ...article,
          isSaved: !article.isSaved,
        }
      }
      return article
    }))
  }, [])

  return {
    articles,
    articlePreviews,
    toggleClap,
    toggleSave,
  }
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | undefined>(() => getArticleBySlug(slug))
  const [isLoading] = useState(false)

  const toggleClap = useCallback(() => {
    setArticle(prev => {
      if (!prev) return prev
      return {
        ...prev,
        isClapped: !prev.isClapped,
        claps: prev.isClapped ? prev.claps - 1 : prev.claps + 1,
      }
    })
  }, [])

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
    toggleClap,
    toggleSave,
  }
}

export function useAuthorArticles(username: string) {
  const [articles] = useState<ArticlePreview[]>(() => getArticlesByAuthor(username))
  const [isLoading] = useState(false)

  return {
    articles,
    isLoading,
  }
}

export function useTagArticles(tag: string) {
  const [articles] = useState<ArticlePreview[]>(() => getArticlesByTag(tag))
  const [isLoading] = useState(false)

  return {
    articles,
    isLoading,
  }
}

export function useSearch(query: string) {
  const [results] = useState<ArticlePreview[]>(() => 
    query ? searchArticles(query) : []
  )
  const [isLoading] = useState(false)

  return {
    results,
    isLoading,
  }
}
