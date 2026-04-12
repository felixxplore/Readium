'use client'

import { useRef, useState, use, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArticleHeader } from '@/components/articles/article-header'
import { ArticleContent } from '@/components/articles/article-content'
import { ArticleActions, ArticleActionsSidebar } from '@/components/articles/article-actions'
import { CommentSection } from '@/components/comments/comment-section'
import { ArticleCard } from '@/components/articles/article-card'
import { PageTransition } from '@/components/shared/page-transition'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { followUser, unfollowUser } from '@/lib/api/follow'
import { getCurrentUser } from '@/lib/api/user'
import { deletePost } from '@/lib/api/posts'
import { useArticle } from '@/lib/hooks/use-articles'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const router = useRouter()
  const { slug } = use(params)
  const { article, isLoading, relatedArticles, toggleClap, toggleSave } = useArticle(slug)
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const commentsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        // User not logged in or error, set to null
        setCurrentUser(null)
      }
    }
    fetchCurrentUser()
  }, [])

  if (!isLoading && !article) {
    notFound()
  }

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFollowToggle = async () => {
    if (!article) {
      return
    }

    const userId = Number(article.author.id)
    if (Number.isNaN(userId)) {
      console.error('Invalid author id for follow action:', article.author.id)
      return
    }

    try {
      if (isFollowing) {
        await unfollowUser(userId)
      } else {
        await followUser(userId)
      }
      setIsFollowing(prev => !prev)
    } catch (err) {
      console.error('Failed to toggle follow:', err)
    }
  }

  const handleEdit = () => {
    if (!article) return
    router.push(`/write/${article.id}`)
  }

  const handleDeleteConfirm = async () => {
    if (!article) return

    setIsDeleting(true)
    try {
      await deletePost(Number(article.id))
      // Redirect to profile after successful deletion
      router.push('/profile')
    } catch (err) {
      console.error('Failed to delete post:', err)
      setShowDeleteDialog(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">Loading article...</div>
        </main>
        <Footer />
      </div>
    )
  }

  console.log('ArticlePage: Article loaded:', {
    id: article.id,
    title: article.title,
    author: {
      id: article.author.id,
      username: article.author.username,
      name: article.author.name
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTransition>
          <div className="flex gap-8">
            {/* Side Actions (Desktop) */}
            <ArticleActionsSidebar
              claps={article.claps}
              commentsCount={article.commentsCount}
              isSaved={article.isSaved}
              isClapped={article.isClapped}
              onClap={toggleClap}
              onSave={toggleSave}
              onScrollToComments={scrollToComments}
            />

            {/* Main Content */}
            <article className="min-w-0 flex-1">
              <ArticleHeader
                article={article}
                isFollowing={isFollowing}
                onFollow={handleFollowToggle}
                isOwnPost={String(currentUser?.id) === article.author.id}
                onEdit={String(currentUser?.id) === article.author.id ? handleEdit : undefined}
                onDelete={String(currentUser?.id) === article.author.id ? () => setShowDeleteDialog(true) : undefined}
              />

              <ArticleContent article={article} />

              {/* Author Card */}
              <div className="mt-16 rounded-lg border bg-card p-6">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Link href={`/profile/${article.author.username}`}>
                    <UserAvatar src={article.author.avatar} name={article.author.name} size="xl" />
                  </Link>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Written by</p>
                    <Link
                      href={`/profile/${article.author.username}`}
                      className="text-xl font-bold hover:underline"
                    >
                      {article.author.name}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-muted-foreground">
                      {article.author.bio}
                    </p>
                  </div>
                  {currentUser?.id !== article.author.id && (
                    <Button
                      variant={isFollowing ? 'secondary' : 'default'}
                      onClick={handleFollowToggle}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection ref={commentsRef} articleId={article.id} />

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section className="mt-16 border-t pt-10">
                  <h2 className="mb-6 font-serif text-2xl font-bold">
                    More from Readium
                  </h2>
                  <div className="space-y-0">
                    {relatedArticles.map(related => (
                      <ArticleCard key={related.id} article={related} />
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>

          {/* Floating Actions (Mobile) */}
          <div className="xl:hidden">
            <ArticleActions
              claps={article.claps}
              commentsCount={article.commentsCount}
              isSaved={article.isSaved}
              isClapped={article.isClapped}
              onClap={toggleClap}
              onSave={toggleSave}
              onScrollToComments={scrollToComments}
            />
          </div>
        </PageTransition>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  )
}
