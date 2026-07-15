import React, { useState, useEffect } from "react";
import {
  Search,
  Heart,
  LogOut,
  Menu,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";

/**
 * FacebookIcon - inline SVG fallback.
 * Some lucide-react versions don't export "Facebook", so we avoid that
 * import entirely and use a small inline SVG instead (same 24x24 style).
 */
function FacebookIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.73C24 .774 23.2 0 22.222 0z" />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * BlogFeedPage - Public blog feed component
 *
 * Props:
 * - posts: Array of BlogPostResponse objects
 * - isLoading: Boolean indicating loading state
 * - isAuthenticated: Boolean indicating if user is logged in
 * - searchQuery: Current search query string
 * - hasMore: Boolean indicating if more posts are available to load
 * - isLoadingMore: Boolean indicating if the next page is currently being fetched
 * - featuredPost: Optional featured post to display in hero
 * - onSearch: Callback function(query) when search is submitted
 * - onLoadMore: Callback function() when "Load More" button is clicked
 * - onPostClick: Callback function(postId) when post card is clicked
 * - onFeaturedPostClick: Callback function(postId) when featured post is clicked
 * - onWriteClick: Callback function() when "Write" button is clicked
 * - onLoginClick: Callback function() when "Login" button is clicked
 * - onSignupClick: Callback function() when "Sign up" button is clicked
 * - onChatClick: Callback function() when "Chat to us" button is clicked
 * - onGetStartedClick: Callback function() when "Get started" button is clicked
 */
export default function BlogFeedPage({
  posts = [],
  isLoading = false,
  isAuthenticated = false,
  searchQuery = "",
  hasMore = false,
  isLoadingMore = false,
  featuredPost = null,
  onSearch = () => {},
  onLoadMore = () => {},
  onPostClick = () => {},
  onFeaturedPostClick = () => {},
  onWriteClick = () => {},
  onLoginClick = () => {},
  onSignupClick = () => {},
  onChatClick = () => {},
  onGetStartedClick = () => {},
}) {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onSearch("");
  };

  const isEmpty = !isLoading && posts.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Untitled UI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Home
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Products
              </a>
              <a href="#" className="text-sm font-medium text-indigo-600">
                Blog
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                About us
              </a>
            </div>

            {/* Search Bar (desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative mr-4"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search posts..."
                className="w-56 pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onWriteClick}
                    className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Write
                  </button>
                  <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center cursor-pointer hover:bg-indigo-300 transition-colors">
                    <span className="text-sm font-semibold text-indigo-700">
                      P
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="px-4 py-2 font-medium text-gray-700 hover:text-gray-900"
                  >
                    Log in
                  </button>
                  <button
                    onClick={onSignupClick}
                    className="px-4 py-2 font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <div className="flex flex-col gap-3 pt-4">
                {/* Search Bar (mobile) */}
                <form onSubmit={handleSearchSubmit} className="relative px-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                <a
                  href="#"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  Products
                </a>
                <a
                  href="#"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-gray-100 rounded"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  About us
                </a>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => {
                          onWriteClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors mb-2"
                      >
                        Write
                      </button>
                      <button className="w-full px-4 py-2 font-medium text-gray-700 text-left hover:bg-gray-100 rounded-lg">
                        Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onLoginClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-lg text-left mb-2"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => {
                          onSignupClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Featured Post Hero */}
      {!searchQuery && !isLoading && featuredPost && (
        <FeaturedPostHero
          post={featuredPost}
          onClick={() => onFeaturedPostClick(featuredPost.id)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Showing results for{" "}
                <span className="text-indigo-600">"{searchQuery}"</span>
                {!isLoading && !isEmpty && (
                  <span className="text-gray-600 font-normal">
                    {" "}
                    ({posts.length} {posts.length === 1 ? "post" : "posts"})
                  </span>
                )}
              </h2>
              <button
                onClick={handleClearSearch}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Clear search
              </button>
            </div>
            <div className="h-1 w-16 bg-indigo-600 rounded mt-2" />
          </div>
        )}

        {/* Recent Blog Posts Section Header */}
        {!searchQuery && !isLoading && posts.length > 0 && (
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Recent blog posts
          </h2>
        )}

        {/* Loading State - Skeleton Cards */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : "No posts yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try searching for something else"
                  : "Be the first to write one!"}
              </p>
              {isAuthenticated && !searchQuery && (
                <button
                  onClick={onWriteClick}
                  className="px-6 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start Writing
                </button>
              )}
            </div>
          </div>
        )}

        {/* Post Grid */}
        {!isLoading && !isEmpty && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => onPostClick(post.id)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && !isEmpty && hasMore && (
          <LoadMoreButton
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
          />
        )}
      </div>

      {/* CTA Section */}
      <CTASection
        onChatClick={onChatClick}
        onGetStartedClick={onGetStartedClick}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FeaturedPostHero({ post, onClick }) {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="z-10 flex flex-col justify-center">
            <span className="inline-block text-sm font-semibold text-white mb-4 max-w-fit">
              Featured
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h2>
            <p className="text-gray-300 text-base mb-6 line-clamp-2">
              {post.excerpt}
            </p>
            <button
              onClick={onClick}
              className="flex items-center gap-2 w-fit text-white hover:text-gray-200 transition-colors"
            >
              <span className="font-medium">Read more</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                <div className="text-indigo-200 text-6xl font-light">📝</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CTASection({ onChatClick, onGetStartedClick }) {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Let&apos;s get started on something great
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Join over 4,000+ startups already growing with Untitled.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onChatClick}
            className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:border-gray-400 hover:bg-gray-800 transition-colors font-medium"
          >
            Chat to us
          </button>
          <button
            onClick={onGetStartedClick}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Get started
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Releases
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Media kit
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Newsletter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help centre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tutorials
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Use cases</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Startups
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Enterprise
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Government
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  SaaS centre
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Social</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  AngelList
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Licenses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-300 text-xs font-bold">U</span>
            </div>
            <span className="text-sm text-gray-400">
              © 2027 Untitled UI. All rights reserved.
            </span>
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PostCard({ post, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col hover:-translate-y-1"
    >
      <div className="relative w-full h-48 bg-gradient-to-br from-indigo-100 to-indigo-50 overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-indigo-200 text-4xl font-light">📝</div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            {post.subtitle}
          </p>
        )}

        <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 my-3" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-indigo-700">
                {post.author?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {post.author?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-600 truncate">
                @{post.author?.username || "user"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <Heart className="w-4 h-4" fill="none" stroke="currentColor" />
            <span className="text-xs font-medium">{post.likeCount || 0}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {formatDate(post.createdAt)}
        </p>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-5/6" />
          <div className="h-5 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-12" />
          <div className="h-6 bg-gray-200 rounded-full w-14" />
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-1/2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="space-y-1 w-full">
                <div className="h-3 bg-gray-200 rounded w-4/5" />
                <div className="h-3 bg-gray-200 rounded w-3/5" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadMoreButton({ isLoadingMore, onLoadMore }) {
  return (
    <div className="flex items-center justify-center mt-4 mb-12">
      <button
        onClick={onLoadMore}
        disabled={isLoadingMore}
        className="flex items-center gap-2 px-6 py-3 font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Load More"
        )}
      </button>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
