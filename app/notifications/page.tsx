'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, Trash2, CheckAll } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/shared/page-transition'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Loader, InlineLoader } from '@/components/shared/loader'
import { useAppSelector } from '@/lib/store/hooks'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  Notification,
} from '@/lib/api/notifications'
import { cn } from '@/lib/utils'

const notificationIcons = {
  like: <Heart className="size-4 fill-red-500 text-red-500" />,
  comment: <MessageCircle className="size-4 text-blue-500" />,
  follow: <UserPlus className="size-4 text-green-500" />,
}

const notificationMessages = {
  like: (name: string) => `${name} liked your post`,
  comment: (name: string) => `${name} commented on your post`,
  follow: (name: string) => `${name} started following you`,
}

export default function NotificationsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector(state => state.auth)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchNotifications = useCallback(async (pageNum: number = 1) => {
    if (!isAuthenticated) {
      router.push('/signin')
      return
    }

    try {
      setIsLoading(true)
      const response = await getNotifications(pageNum, 20)
      if (pageNum === 1) {
        setNotifications(response.notifications)
      } else {
        setNotifications(prev => [...prev, ...response.notifications])
      }
      setUnreadCount(response.unreadCount)
      setHasMore(response.notifications.length === 20)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load notifications'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchNotifications(1)
  }, [fetchNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
    fetchNotifications(page + 1)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Please sign in to view your notifications.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <PageTransition>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="gap-2"
                >
                  <CheckAll className="size-4" />
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-destructive/10 p-4 text-destructive"
              >
                {error}
              </motion.div>
            )}

            {/* Loading */}
            {isLoading && notifications.length === 0 && (
              <div className="flex justify-center py-12">
                <Loader size="lg" text="Loading notifications..." variant="default" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && notifications.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Bell className="mx-auto mb-4 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                    notification.isRead ? 'bg-background' : 'bg-muted/50'
                  )}
                >
                  {/* Icon */}
                  <div className="mt-1 flex-shrink-0">
                    {notificationIcons[notification.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-8 w-8"
                      >
                        <div className="size-2 rounded-full bg-primary" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center pt-4"
              >
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className={isLoading ? 'gap-2' : ''}
                >
                  {isLoading ? (
                    <>
                      <InlineLoader size="sm" text="" />
                      Loading...
                    </>
                  ) : (
                    'Load more'
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
