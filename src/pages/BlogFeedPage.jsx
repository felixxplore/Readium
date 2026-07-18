
import React, { useState, useEffect, useCallback } from 'react'
import { Search, Menu, X, Loader2 } from 'lucide-react'

export default function ModernEditorialFeed({
  posts,
  isLoading,
  isLoadingMore,
  hasMore,
  isAuthenticated,
  searchQuery,
  popularPosts,
  onSearch,
  onLoadMore,
  onPostClick,
  onFeaturedPostClick,
  onWriteClick,
  onLoginClick,
  onSignupClick,
  onNavigate,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [filteredCategory, setFilteredCategory] = useState('ALL')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)

  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (!searchQuery || popularPosts.length === 0 || isCarouselPaused) return

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % popularPosts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [searchQuery, popularPosts.length, isCarouselPaused])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearchQuery)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const estimateReadTime = (excerpt) => {
    const wordCount = excerpt.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)
    return `${readTime} min read`
  }

  const SKeletonCard = () => (
    <div className="bg-white rounded-sm p-6 shadow-[0px_20px_40px_rgba(0,0,0,0.05)] animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-sm mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-sm mb-3 w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded-sm mb-3"></div>
      <div className="h-4 bg-gray-200 rounded-sm w-2/3"></div>
    </div>
  )

  const CarouselSlide = ({ post, isActive }) => (
    <div
      className={`absolute inset-0 transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => onFeaturedPostClick(post.id)}
    >
      <div className="relative w-full h-full flex items-center justify-center cursor-pointer group">
        <div className="absolute inset-0 rounded-sm overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f3f3f3] to-[#e8e8e8]"></div>
          )}
        </div>

        <div className="absolute bottom-0 right-0 md:bottom-8 md:right-8 bg-white rounded-sm p-6 shadow-[0px_20px_40px_rgba(0,0,0,0.15)] w-full md:w-96 z-10">
          <h3
            className="font-serif text-2xl md:text-3xl leading-tight mb-2 text-black"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {post.title}
          </h3>
          <p className="text-sm text-[#666] line-clamp-1 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest font-medium text-[#444748]">
            <span>{estimateReadTime(post.excerpt)}</span>
            <span className="text-[#C5A059]">• {post.likeCount} likes</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-[20px] border-b border-black/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="text-lg font-serif font-normal italic tracking-wide hover:opacity-70 transition-opacity cursor-pointer"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            LUMEN EDITORIAL
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs uppercase tracking-widest font-medium border-b-2 border-black hover:opacity-70 transition-opacity"
            >
              Feed
            </button>
            <button
              onClick={() => onNavigate('authors')}
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
            >
              Authors
            </button>
            <a href="#" className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black">
              Series
            </a>
            <button
              onClick={() => onNavigate('about')}
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onWriteClick}
                    className="px-6 py-2 bg-black text-white text-xs font-medium rounded-sm hover:bg-gray-900 transition-colors"
                  >
                    WRITE
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B7043]"></div>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="text-xs font-medium text-gray-700 hover:text-black"
                  >
                    SIGN IN
                  </button>
                  <button
                    onClick={onWriteClick}
                    className="px-6 py-2 bg-black text-white text-xs font-medium rounded-sm hover:bg-gray-900 transition-colors"
                  >
                    WRITE
                  </button>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/10 mt-4 pt-4 space-y-3">
            <button
              onClick={() => {
                onNavigate('home')
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-xs uppercase tracking-widest font-medium"
            >
              Feed
            </button>
            <button
              onClick={() => {
                onNavigate('authors')
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-xs uppercase tracking-widest font-medium text-gray-700"
            >
              Authors
            </button>
            <a href="#" className="block text-xs uppercase tracking-widest font-medium text-gray-700">
              Series
            </a>
            <button
              onClick={() => {
                onNavigate('about')
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-xs uppercase tracking-widest font-medium text-gray-700"
            >
              About
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!searchQuery && popularPosts.length > 0 && (
          <div className="mb-16 fade-in-up">
            <div
              className="relative w-full rounded-sm overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.1)] group"
              style={{ aspectRatio: '16 / 9', minHeight: '400px' }}
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
              onTouchStart={() => setIsCarouselPaused(true)}
              onTouchEnd={() => setIsCarouselPaused(false)}
            >
              {popularPosts.map((post, index) => (
                <CarouselSlide
                  key={post.id}
                  post={post}
                  isActive={index === carouselIndex}
                />
              ))}

              <button
                onClick={() => setCarouselIndex((prev) => (prev - 1 + popularPosts.length) % popularPosts.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-black/10 rounded-sm"
                aria-label="Previous slide"
              >
                <svg
                  className="w-6 h-6 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() => setCarouselIndex((prev) => (prev + 1) % popularPosts.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-black/10 rounded-sm"
                aria-label="Next slide"
              >
                <svg
                  className="w-6 h-6 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {popularPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`transition-all ${
                      index === carouselIndex
                        ? 'w-2 h-2 bg-black rounded-full'
                        : 'w-2 h-2 bg-black/20 rounded-full hover:bg-black/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 md:max-w-md">
            <div className="relative">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Search stories, authors, or tags..."
                className="w-full text-sm bg-transparent border-b-2 border-[#c4c7c7] py-2 focus:outline-none focus:border-black transition-colors placeholder-gray-500"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="flex gap-4 items-center">
            {['ALL', 'CULTURE', 'DESIGN', 'TECHNOLOGY', 'ESSAYS'].map((category) => (
              <button
                key={category}
                onClick={() => setFilteredCategory(category)}
                className={`text-xs uppercase tracking-widest font-medium transition-colors ${
                  filteredCategory === category
                    ? 'text-black border-b-2 border-black'
                    : 'text-[#444748] hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-12 pb-8 border-b border-black/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
                  Showing results for &quot;{searchQuery}&quot;
                </h2>
                <div className="h-1 w-12 bg-[#C5A059]"></div>
              </div>
              <button
                onClick={() => onSearch('')}
                className="text-xs text-[#C5A059] hover:text-[#8B7043] font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <SKeletonCard key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#444748] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              {searchQuery ? 'No stories found' : 'No posts available'}
            </p>
            <p className="text-sm text-[#444748]">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Check back soon for new content'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {posts.map((post, index) => (
              <article
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="group cursor-pointer fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="mb-4 rounded-sm overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.05)] group-hover:shadow-[0px_30px_60px_rgba(0,0,0,0.1)] transition-shadow">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:opacity-95 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#f3f3f3] to-[#e8e8e8]"></div>
                  )}
                </div>

                <div className="bg-white rounded-sm p-5 shadow-[0px_20px_40px_rgba(0,0,0,0.05)] group-hover:shadow-[0px_30px_60px_rgba(0,0,0,0.1)] transition-shadow">
                  {post.tags.length > 0 && (
                    <p className="text-xs uppercase tracking-widest font-medium text-[#C5A059] mb-3">
                      {post.tags[0]}
                    </p>
                  )}

                  <h3 className="font-serif text-xl leading-tight mb-3 text-black group-hover:text-[#C5A059] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                    {post.title}
                  </h3>

                  <p className="text-sm text-[#444748] line-clamp-2 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="uppercase tracking-widest font-medium text-[#444748]">
                        {post.author.name}
                      </span>
                    </div>
                    <span className="text-[#444748]">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center mb-16">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 border-2 border-black text-black font-medium text-sm rounded-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-black/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="font-serif italic text-base tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
              LUMEN EDITORIAL
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
              <p className="text-xs text-[#444748]">
                © 2024 Lumen Editorial. All rights reserved. Dedicated to the preservation of high-end digital craftsmanship.
              </p>
              <div className="flex flex-wrap gap-6 text-xs">
                <a href="#" className="text-[#444748] hover:text-black transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-[#444748] hover:text-black transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-[#444748] hover:text-black transition-colors">
                  Press Kit
                </a>
                <a href="#" className="text-[#444748] hover:text-black transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
