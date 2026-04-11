'use client'

import { getStoredTokens, isTokenExpired, updateStoredAccessToken } from '@/lib/auth/session'
import { refreshAccessToken } from '@/lib/api/auth'

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

async function apiRequest(path: string, init: RequestInit = {}, requiresAuth = false) {
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Request failed'))
  }

  return payload
}

export async function likePost(postId: number) {
  return apiRequest(`/likes/post/${postId}`, { method: 'POST' }, true)
}

export async function unlikePost(postId: number) {
  return apiRequest(`/likes/post/${postId}/unlike`, { method: 'POST' }, true)
}

export async function likeComment(commentId: number) {
  return apiRequest(`/likes/comment/${commentId}`, { method: 'POST' }, true)
}

export async function unlikeComment(commentId: number) {
  return apiRequest(`/likes/comment/${commentId}/unlike`, { method: 'POST' }, true)
}
