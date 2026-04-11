'use client'

import { useRef, useState, use } from 'react'
import { notFound } from 'next/navigation'
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
import { useArticle } from '@/lib/hooks/use-articles'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = use(params)
  const { article, isLoading, relatedArticles, toggleClap, toggleSave } = useArticle(slug)
  const [isFollowing, setIsFollowing] = useState(false)
  const commentsRef = useRef<HTMLElement>(null)

  if (!isLoading && !article) {
    notFound()
  }

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' })
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
                onFollow={() => setIsFollowing(!isFollowing)}
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
                  <Button
                    variant={isFollowing ? 'secondary' : 'default'}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
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

      <Footer />
    </div>
  )
}
