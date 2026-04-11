const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')

interface AuthRequestOptions {
  method?: 'POST' | 'GET'
  body?: unknown
}

export interface UserProfileResponse {
  id: number
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  followerCount: number
  followingCount: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: UserProfileResponse
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  username: string
}

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

async function authRequest(path: string, options: AuthRequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Authentication request failed'))
  }

  return payload
}

function normalizeAuthResponse(payload: unknown): AuthTokens {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid auth response from server')
  }

  const accessToken = (payload as { accessToken?: unknown }).accessToken
  const refreshToken = (payload as { refreshToken?: unknown }).refreshToken
  const user = (payload as { user?: unknown }).user

  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    throw new Error('Auth response is missing tokens')
  }

  if (!user || typeof user !== 'object') {
    throw new Error('Auth response is missing user info')
  }

  return { accessToken, refreshToken, user: user as UserProfileResponse }
}

export async function registerUser(payload: RegisterPayload) {
  const response = await authRequest('/auth/register', {
    body: payload,
  })

  return normalizeAuthResponse(response)
}

export async function loginUser(payload: LoginPayload) {
  const response = await authRequest('/auth/login', {
    body: payload,
  })

  return normalizeAuthResponse(response)
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await authRequest('/auth/refresh', {
    body: { refreshToken },
  })

  return normalizeAuthResponse(response)
}
