'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppSelector } from '@/lib/store/hooks'
import { getCurrentUser } from '@/lib/api/user'
import { getMyPosts, getSavedPosts } from '@/lib/api/posts'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ArticleCard } from '@/components/articles/article-card'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UserProfile } from '@/types'
import type { ArticlePreview } from '@/lib/api/posts'

export default function ProfilePage() {
  const router = useRouter()
  const currentUser = useAppSelector(state => state.auth.user)
  const [user, setUser] = useState<UserProfile | undefined>()
  const [myPosts, setMyPosts] = useState<ArticlePreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
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

        // Fetch user's posts
        try {
          setIsLoadingPosts(true)
          const postsData = await getMyPosts(0, 10)
          setMyPosts(postsData.posts)
        } catch (err) {
          console.error('Failed to load my posts:', err)
          setMyPosts([])
        } finally {
          setIsLoadingPosts(false)
        }
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
          <ProfileHeader user={user} isOwnProfile={true} />

          {/* About Section */}
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>{user.bio || 'No bio provided'}</p>
          </div>

          {/* My Posts Section */}
          <section className="mt-12 border-t pt-10">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold">My Posts</h2>
              <Link href="/write">
                <Button>Write New Post</Button>
              </Link>
            </div>

            {isLoadingPosts ? (
              <div className="text-center text-muted-foreground">Loading posts...</div>
            ) : myPosts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-muted-foreground/50 p-8 text-center">
                <p className="text-muted-foreground">No posts yet. Start writing to share your thoughts!</p>
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    You have published <strong className="text-foreground">{myPosts.length}</strong> post{myPosts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-4">
                  {myPosts.map(post => (
                    <ArticleCard key={post.id} article={post} />
                  ))}
                </div>
              </>
            )}
          </section>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}
