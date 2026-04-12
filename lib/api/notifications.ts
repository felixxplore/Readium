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

export interface Notification {
  id: string
  userId: string
  type: 'like' | 'comment' | 'follow'
  message: string
  relatedUserId?: string
  relatedPostId?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationResponse {
  notifications: Notification[]
  unreadCount: number
}

export async function getNotifications(page: number = 1, limit: number = 20): Promise<NotificationResponse> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('Please sign in to view notifications')
  }

  const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch notifications')
  }

  return response.json()
}

export async function getUnreadCount(): Promise<number> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('Please sign in')
  }

  const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch unread count')
  }

  const data = await response.json()
  return data.unreadCount || 0
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('Please sign in')
  }

  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to mark notification as read')
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('Please sign in')
  }

  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read')
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('Please sign in')
  }

  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete notification')
  }
}
