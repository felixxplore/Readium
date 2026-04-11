'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import { getUserByUsername } from '@/lib/data/fake-users'
import { getArticlesByAuthor } from '@/lib/data/fake-articles'
import type { User } from '@/types/user'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileHeader } from '@/components/profile/profile-header'
import { PageTransition } from '@/components/shared/page-transition'
import type { UserProfile } from '@/types'

export default function ProfilePage() {
  const params = useParams()
  const username = typeof params?.username === 'string' ? params.username : undefined
  const [user, setUser] = useState<UserProfile | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!username) {
      setIsLoading(false)
      return
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true)
        const userData = getUserByUsername(username)
        if (!userData) {
          setUser(undefined)
          setIsLoading(false)
          return
        }
        const authorArticles = getArticlesByAuthor(username)
        const articlesCount = authorArticles.length
        setUser({
          ...userData,
          followers: userData.followers,
          following: userData.following,
          articlesCount,
          isFollowing: false,
          articles: authorArticles.map(a => a.id),
          savedArticles: [],
        } as UserProfile)
      } catch (err) {
        console.error('Failed to load profile:', err)
        setUser(undefined)
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [username])


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
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTransition>
          <ProfileHeader user={user} isOwnProfile={false} onFollow={() => {}} />

          {/* Profile Content */}
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* About Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About</h2>
                <p className="text-muted-foreground">{user.bio || 'No bio provided.'}</p>
              </div>
              
              {/* Stats */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Stats</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{user.articlesCount}</div>
                    <div>Stories</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{user.followers}</div>
                    <div>Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}
