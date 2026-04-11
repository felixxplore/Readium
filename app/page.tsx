'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Sidebar } from '@/components/layout/sidebar'
import { ArticleCard } from '@/components/articles/article-card'
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/shared/page-transition'
import { useArticles } from '@/lib/hooks/use-articles'
import { cn } from '@/lib/utils'

const tabs = ['For you', 'Following', 'Technology', 'Design', 'Startups']

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('For you')
  const { articlePreviews, isLoading, error, toggleSave } = useArticles()

  const articles = useMemo(() => {
    return articlePreviews
  }, [activeTab, articlePreviews])

  const featuredArticle = articles[0]
  const feedArticles = articles.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageTransition>
          {/* Featured Article */}
          <section className="mb-12">
            {featuredArticle && (
              <ArticleCard article={featuredArticle} featured onSave={toggleSave} />
            )}
          </section>

          <div className="flex gap-16">
            {/* Main Content */}
            <div className="min-w-0 flex-1">
              {/* Tabs */}
              <nav className="mb-6 flex gap-1 overflow-x-auto border-b scrollbar-hide">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
                      activeTab === tab
                        ? 'border-b-2 border-foreground text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              {/* Article Feed */}
              {isLoading ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>Loading stories...</p>
                </div>
              ) : (
                <StaggerChildren>
                  {feedArticles.map(article => (
                    <StaggerItem key={article.id}>
                      <ArticleCard article={article} onSave={toggleSave} />
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              )}

              {error && (
                <div className="py-6 text-sm text-destructive">
                  <p>{error}</p>
                </div>
              )}

              {!isLoading && feedArticles.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No articles found in this category.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}
