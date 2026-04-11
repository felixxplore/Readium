'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import type { UserProfile } from '@/types'

interface ProfileHeaderProps {
  user: UserProfile
  isOwnProfile: boolean
  onFollow?: () => void
}

export function ProfileHeader({ user, isOwnProfile, onFollow }: ProfileHeaderProps) {
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

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
              <strong className="text-foreground">{user.followers.toLocaleString()}</strong> Followers
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
              variant={user.isFollowing ? 'secondary' : 'default'}
              onClick={onFollow}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
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
