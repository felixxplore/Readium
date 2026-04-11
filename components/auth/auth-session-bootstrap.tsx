'use client'

import { useEffect } from 'react'
import { refreshAccessToken } from '@/lib/api/auth'
import { useAppDispatch } from '@/lib/store/hooks'
import { logout, setUser } from '@/lib/features/auth/auth-slice'
import {
  clearStoredSession,
  getStoredProfile,
  getStoredTokens,
  isTokenExpired,
  updateStoredAccessToken,
  storeTokens,
} from '@/lib/auth/session'
import type { User } from '@/types'

function profileToUser(profile: ReturnType<typeof getStoredProfile>): User | null {
  if (!profile) return null

  return {
    id: String(profile.id),
    username: profile.username,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    bio: profile.bio,
    followers: profile.followerCount,
    following: profile.followingCount,
    articlesCount: 0,
    createdAt: new Date().toISOString(),
  }
}

export function AuthSessionBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let isMounted = true

    const hydrateSession = async () => {
      const { accessToken, refreshToken } = getStoredTokens()
      const profile = getStoredProfile()

      if (!accessToken && !refreshToken) {
        return
      }

      try {
        let activeAccessToken = accessToken
        let activeProfile = profile

        if ((!activeAccessToken || isTokenExpired(activeAccessToken)) && refreshToken) {
          const refreshed = await refreshAccessToken(refreshToken)
          activeAccessToken = refreshed.accessToken
          activeProfile = refreshed.user
          updateStoredAccessToken(refreshed.accessToken)
          storeTokens(refreshed.accessToken, refreshToken, refreshed.user)
        }

        if (!activeAccessToken || !activeProfile) {
          throw new Error('Missing access token or profile')
        }

        const user = profileToUser(activeProfile)

        if (!user) {
          throw new Error('Unable to restore authenticated user')
        }

        if (isMounted) {
          dispatch(setUser(user))
        }
      } catch {
        clearStoredSession()
        if (isMounted) {
          dispatch(logout())
        }
      }
    }

    void hydrateSession()

    return () => {
      isMounted = false
    }
  }, [dispatch])

  return null
}
