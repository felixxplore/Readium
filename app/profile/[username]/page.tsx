'use client'

import { useState, use } from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ArticleCard } from '@/components/articles/article-card'
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/shared/page-transition'
import { useUserProfile } from '@/lib/hooks/use-user'
import { useAuthorArticles } from '@/lib/hooks/use-articles'
import { useAppSelector } from '@/lib/store/hooks'
import { cn } from '@/lib/utils'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

const tabs = ['Stories', 'About']

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params)
  const { user, toggleFollow } = useUserProfile(username)
  const { articles } = useAuthorArticles(username)
  const currentUser = useAppSelector(state => state.auth.user)
  const [activeTab, setActiveTab] = useState('Stories')

  if (!user) {
    notFound()
  }

  const isOwnProfile = currentUser?.username === user.username

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTransition>
          <ProfileHeader
            user={user}
            isOwnProfile={isOwnProfile}
            onFollow={toggleFollow}
          />

          {/* Tabs */}
          <nav className="mt-8 flex gap-1 border-b">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'border-b-2 border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'Stories' && (
              <StaggerChildren>
                {articles.length > 0 ? (
                  articles.map(article => (
                    <StaggerItem key={article.id}>
                      <ArticleCard article={article} />
                    </StaggerItem>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>{isOwnProfile ? 'You have not written any stories yet.' : 'No stories yet.'}</p>
                  </div>
                )}
              </StaggerChildren>
            )}

            {activeTab === 'About' && (
              <div className="py-8">
                <h2 className="mb-4 font-serif text-xl font-bold">About {user.name}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {user.bio || 'No bio available.'}
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border p-6">
                    <p className="text-3xl font-bold">{user.articlesCount}</p>
                    <p className="text-muted-foreground">Stories published</p>
                  </div>
                  <div className="rounded-lg border p-6">
                    <p className="text-3xl font-bold">{user.followers.toLocaleString()}</p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}
