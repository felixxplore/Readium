import { notFound } from 'next/navigation'
import { getPublicProfile } from '@/lib/api/user'
import { getPostsByAuthor } from '@/lib/api/posts'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileHeader } from '@/components/profile/profile-header'
import { PageTransition } from '@/components/shared/page-transition'
import type { UserProfile } from '@/types'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const {username }= await params;

  console.log("Params : ", params );

  console.log('ProfilePage: Loading profile for username:', username)

  if (!username) {
    console.log('ProfilePage: No username provided')
    notFound()
  }

  const profile = await getPublicProfile(username)

  console.log('ProfilePage: Fetched profile:', { id: profile.id, username: profile.username, name: profile.name })

  if (!profile) {
    console.log('ProfilePage: Profile not found')
    notFound()
  }

  const { posts, totalElements } = await getPostsByAuthor(username, 0, 50)

  console.log('ProfilePage: Fetched posts count:', totalElements)

  const user: UserProfile = {
    id: String(profile.id),
    username: profile.username,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    bio: profile.bio,
    followers: profile.followerCount,
    following: profile.followingCount,
    articlesCount: totalElements,
    isFollowing: false,
    articles: posts.map(post => post.id),
    savedArticles: [],
    createdAt: new Date().toISOString(),
  }

  console.log('ProfilePage: Final user object:', { username: user.username, name: user.name })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTransition>
          <ProfileHeader user={user} isOwnProfile={false} />

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About</h2>
                <p className="text-muted-foreground">{user.bio || 'No bio provided.'}</p>
              </div>

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
