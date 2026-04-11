'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  isFollowing: boolean
  onToggle: () => void
  size?: 'sm' | 'default'
}

export function FollowButton({ isFollowing, onToggle, size = 'default' }: FollowButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        variant={isFollowing ? 'secondary' : 'default'}
        size={size}
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'min-w-[100px] transition-all',
          isFollowing && isHovered && 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
        )}
      >
        {isFollowing ? (isHovered ? 'Unfollow' : 'Following') : 'Follow'}
      </Button>
    </motion.div>
  )
}
