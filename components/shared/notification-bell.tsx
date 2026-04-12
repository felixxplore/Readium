'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { getUnreadCount } from '@/lib/api/notifications'
import { cn } from '@/lib/utils'

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUnreadCount = useCallback(async () => {
    try {
      setIsLoading(true)
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch (err) {
      // Silently fail - user may not be authenticated
      setError('')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch unread count on mount and set up polling
  useEffect(() => {
    fetchUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="size-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-2 -top-2 flex items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground"
              style={{
                width: unreadCount > 99 ? '24px' : '20px',
                height: '20px',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </Link>
  )
}
