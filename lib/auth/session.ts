'use client'

import type { User } from '@/types'
import type { UserProfileResponse } from '@/lib/api/auth'

const ACCESS_TOKEN_KEY = 'readium.accessToken'
const REFRESH_TOKEN_KEY = 'readium.refreshToken'
const PROFILE_KEY = 'readium.profile'

export interface StoredTokens {
  accessToken: string | null
  refreshToken: string | null
}

function canUseStorage() {
  return typeof window !== 'undefined'
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  const padded = padding ? normalized.padEnd(normalized.length + (4 - padding), '=') : normalized

  return atob(padded)
}

function decodeJwtPayload(token: string) {
  try {
    const [, payload] = token.split('.')
    if (!payload) {
      return null
    }

    return JSON.parse(decodeBase64Url(payload)) as Record<string, unknown>
  } catch {
    return null
  }
}

function formatNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? email

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function slugifyName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function createUsername(name: string, email: string) {
  const normalizedName = slugifyName(name)
  if (normalizedName) {
    return normalizedName
  }

  return email.split('@')[0]?.toLowerCase() ?? `user${Date.now()}`
}

export function getStoredTokens(): StoredTokens {
  if (!canUseStorage()) {
    return { accessToken: null, refreshToken: null }
  }

  return {
    accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  }
}

export function storeTokens(accessToken: string, refreshToken: string, user: UserProfileResponse) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(user))
}

export function updateStoredAccessToken(accessToken: string) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function clearStoredSession() {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.localStorage.removeItem(PROFILE_KEY)
}

export function getStoredProfile() {
  if (!canUseStorage()) {
    return null
  }

  const rawProfile = window.localStorage.getItem(PROFILE_KEY)
  if (!rawProfile) {
    return null
  }

  try {
    return JSON.parse(rawProfile) as UserProfileResponse
  } catch {
    return null
  }
}

export function isTokenExpired(token: string) {
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp

  if (typeof exp !== 'number') {
    return false
  }

  return exp * 1000 <= Date.now()
}

export function getEmailFromToken(token: string) {
  const payload = decodeJwtPayload(token)
  const subject = payload?.sub
  const email = payload?.email

  if (typeof email === 'string' && email) {
    return email
  }

  if (typeof subject === 'string' && subject) {
    return subject
  }

  return null
}

export function createAuthUser(params: {
  accessToken?: string
  email?: string
  name?: string
}): User | null {
  const email = params.email ?? (params.accessToken ? getEmailFromToken(params.accessToken) : null)
  if (!email) {
    return null
  }

  const name = params.name?.trim() || formatNameFromEmail(email)

  return {
    id: `user-${email.toLowerCase()}`,
    username: createUsername(name, email),
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    bio: '',
    followers: 0,
    following: 0,
    articlesCount: 0,
    createdAt: new Date().toISOString(),
  }
}

export function createPublicUserFromName(name: string): User {
  const normalizedName = name.trim() || 'Readium Writer'
  const username = slugifyName(normalizedName) || 'readiumwriter'

  return {
    id: `user-${username}`,
    username,
    name: normalizedName,
    email: `${username}@readium.local`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedName)}`,
    bio: 'Writer on Readium.',
    followers: 0,
    following: 0,
    articlesCount: 0,
    createdAt: new Date().toISOString(),
  }
}
