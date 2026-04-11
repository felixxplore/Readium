'use client'

import { useState, useCallback } from 'react'
import { getUserByUsername, fakeUsers } from '@/lib/data/fake-users'
import type { User, UserProfile } from '@/types'
import { fakeArticles } from '@/lib/data/fake-articles'

export function useUserProfile(username: string) {
  const [user, setUser] = useState<UserProfile | undefined>(() => {
    const foundUser = getUserByUsername(username)
    if (!foundUser) return undefined
    
    const userArticles = fakeArticles
      .filter(a => a.author.username === username)
      .map(a => a.id)
    
    return {
      ...foundUser,
      isFollowing: false,
      articles: userArticles,
      savedArticles: [],
    }
  })
  const [isLoading] = useState(false)

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
    toggleFollow,
  }
}

export function useRecommendedUsers() {
  const [users] = useState<User[]>(() => fakeUsers.slice(0, 5))
  const [isLoading] = useState(false)

  return {
    users,
    isLoading,
  }
}
