'use client'

import { useState, useCallback, useEffect } from 'react'
import { followUser, unfollowUser } from '@/lib/api/follow'
import { getUserByUsername } from '@/lib/data/fake-users'
import { getArticlesByAuthor, getAllPosts } from '@/lib/data/fake-articles'
import type { UserProfile } from '@/types'
import type { User } from '@/types/user'

  
export function useUserProfile(username: string) {
  const [user, setUser] = useState<UserProfile | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        setIsLoading(true)
        setError('')
        const profile = getUserByUsername(username)
        
        if (!isMounted || !profile) {
          return
        }
        const authorArticles = getArticlesByAuthor(username)
        const totalElements = authorArticles.length
        if (!isMounted) {
          return
        }
        setUser({
          ...profile,
          followers: profile.followers,
          following: profile.following,
          articlesCount: totalElements,
          isFollowing: false,
          articles: authorArticles.map(post => post.id),
          savedArticles: [],
          createdAt: new Date().toISOString(),
        } as UserProfile)
      } catch (err) {
        if (isMounted) {
          setUser(undefined)
          setError(err instanceof Error ? err.message : 'Failed to load user profile')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadUser()

    return () => {
      isMounted = false
    }
  }, [username])

  const toggleFollow = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev
      return {
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
      }
    })
  }, [])

  return {
    user,
    isLoading,
    error,
    toggleFollow,
  }
}

export function useRecommendedUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const posts = await getAllPosts()
        const uniqueAuthorsMap = new Map<string, UserProfile>()

        for (const post of posts) {
          if (!uniqueAuthorsMap.has(post.author.username) && post.author.username && post.author.username.trim()) {
            try {
              const profile = getUserByUsername(post.author.username)
              if (isMounted && profile) {
                uniqueAuthorsMap.set(post.author.username, {
                  ...profile,
                  followers: profile.followers,
                  following: profile.following,
                  articlesCount: 0,
                  isFollowing: false,
                  articles: [],
                  savedArticles: [],
                  createdAt: new Date().toISOString(),
                } as UserProfile)
              }
            } catch (err) {
              // Skip users that fail to load
              console.error('Failed to load author profile:', { username: post.author.username, error: err })
            }
          }
        }

        if (isMounted) {
          setUsers(Array.from(uniqueAuthorsMap.values()).slice(0, 5))
        }
      } catch {
        if (isMounted) {
          setUsers([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    users,
    isLoading,
  }
}
