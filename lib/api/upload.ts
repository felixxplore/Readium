'use client'

import { getStoredTokens, isTokenExpired, updateStoredAccessToken } from '@/lib/auth/session'
import { refreshAccessToken } from '@/lib/api/auth'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')

async function getAccessToken() {
  const { accessToken, refreshToken } = getStoredTokens()

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken
  }

  if (refreshToken) {
    try {
      const refreshedTokens = await refreshAccessToken(refreshToken)
      updateStoredAccessToken(refreshedTokens.accessToken)
      return refreshedTokens.accessToken
    } catch {
      return null
    }
  }

  return null
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  const token = await getAccessToken()
  if (!token) {
    throw new Error('Please sign in to upload images')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to upload image')
  }

  const data = (await response.json()) as UploadResponse
  return data.url
}
