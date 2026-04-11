'use client'

import { getStoredTokens, isTokenExpired, updateStoredAccessToken } from '@/lib/auth/session'
import { refreshAccessToken } from '@/lib/api/auth'
import type { UserProfileResponse } from '@/lib/api/auth'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const message = (payload as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

async function getAccessToken() {
  const { accessToken, refreshToken } = getStoredTokens()

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken
  }

  if (refreshToken) {
    try {
      const refreshed = await refreshAccessToken(refreshToken)
      updateStoredAccessToken(refreshed.accessToken)
      return refreshed.accessToken
    } catch {
      return null
    }
  }

  return null
}

async function apiRequest<T>(path: string, init: RequestInit = {}, requiresAuth = false) {
  const headers = new Headers(init.headers)

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (requiresAuth) {
    const token = await getAccessToken()
    if (!token) {
      throw new Error('Please sign in to continue')
    }

    headers.set('Authorization', `Bearer ${token}`)
  }

  const fullUrl = `${API_BASE_URL}${path}`
  console.debug('[API] Fetching', { fullUrl, path, baseUrl: API_BASE_URL })

  const response = await fetch(fullUrl, {
    ...init,
    headers,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    console.error('[API] Request failed', { fullUrl, status: response.status, error: payload })
    throw new Error(getErrorMessage(payload, 'Request failed'))
  }

  return payload as T
}

export async function getCurrentUser() {
  console.debug('[API] getCurrentUser: calling /user/me')
  return apiRequest<UserProfileResponse>('/user/me', { method: 'GET' }, true)
}

export async function getPublicProfile(username: string) {
  if (!username) {
    console.error('[API] getPublicProfile: username is empty/undefined', { username })
    throw new Error('Username is required to fetch public profile')
  }
  console.debug('[API] getPublicProfile: calling /user/' + username, { username })
  return apiRequest<UserProfileResponse>(`/user/${username}`, { method: 'GET' })
}

export interface UpdateProfilePayload {
  name: string
  avatar: string
  bio: string
}

export async function updateProfile(payload: UpdateProfilePayload) {
  console.debug('[API] updateProfile: calling PUT /user/me', { payload })
  return apiRequest<UserProfileResponse>('/user/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, true)
}
