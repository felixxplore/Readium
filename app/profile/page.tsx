'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/store/hooks'
import { getCurrentUser } from '@/lib/api/user'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileHeader } from '@/components/profile/profile-header'
import { PageTransition } from '@/components/shared/page-transition'
import type { UserProfile } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const currentUser = useAppSelector(state => state.auth.user)
  const [user, setUser] = useState<UserProfile | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Stories')

  useEffect(() => {
    if (!currentUser) {
      // Not logged in, redirect to home
      router.push('/')
      return
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true)
        // Get current user's full profile from /api/user/me
        const profile = await getCurrentUser()

        setUser({
          id: String(profile.id),
          username: profile.username,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
          bio: profile.bio,
          followers: profile.followerCount,
          following: profile.followingCount,
          articlesCount: 0,
          isFollowing: false,
          articles: [],
          savedArticles: [],
          createdAt: new Date().toISOString(),
        })
      } catch (err) {
        console.error('Failed to load profile:', err)
        setUser(undefined)
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [currentUser, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">Loading profile...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">Failed to load profile</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTransition>
          <ProfileHeader user={user} isOwnProfile={true} onFollow={() => {}} />

          {/* About Tab */}
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>{user.bio || 'No bio provided'}</p>
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}
