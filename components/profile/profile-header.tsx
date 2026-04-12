'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { followUser, unfollowUser } from '@/lib/api/follow'
import { toast } from '@/hooks/use-toast'
import type { UserProfile } from '@/types'

interface ProfileHeaderProps {
  user: UserProfile
  isOwnProfile: boolean
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [followers, setFollowers] = useState(user.followers)
  const [isLoading, setIsLoading] = useState(false)
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const handleFollowToggle = async () => {
    const userId = Number(user.id)
    if (Number.isNaN(userId)) {
      toast({
        title: 'Unable to follow user',
        description: 'The profile does not have a valid user id.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser(userId)
        setFollowers((value) => Math.max(value - 1, 0))
      } else {
        await followUser(userId)
        setFollowers((value) => value + 1)
      }
      setIsFollowing((prev) => !prev)
    } catch (error) {
      toast({
        title: 'Follow action failed',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to update follow status. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b pb-8"
    >
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <UserAvatar src={user.avatar} name={user.name} size="xl" className="size-20 sm:size-24" />

        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{user.name}</h1>
          <p className="mt-1 text-muted-foreground">@{user.username}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{followers.toLocaleString()}</strong> Followers
            </span>
            <span>
              <strong className="text-foreground">{user.following.toLocaleString()}</strong> Following
            </span>
            <span>Member since {formattedDate}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isOwnProfile ? (
            <Link href="/settings">
              <Button variant="outline">
                <Settings className="mr-2 size-4" />
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Button
              variant={isFollowing ? 'secondary' : 'default'}
              onClick={handleFollowToggle}
              disabled={isLoading}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      {user.bio && (
        <p className="mt-6 text-lg leading-relaxed text-foreground">{user.bio}</p>
      )}
    </motion.header>
  )
}
