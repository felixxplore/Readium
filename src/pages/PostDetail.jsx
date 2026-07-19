"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Edit2,
  Trash2,
  Search,
  Menu,
} from "lucide-react";

export default function PostDetail({
  post = null,
  isLoading = false,
  isOwner = false,
  isAuthenticated = false,
  onEditClick = () => {},
  onDeleteConfirm = () => {},
  onAuthorClick = () => {},
  onBackClick = () => {},
  onNavigate = () => {},
  onSignInClick = () => {},
  onWriteClick = () => {},
}) {
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="h-12 bg-white border-b"></div>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-12"></div>
          <div className="h-64 bg-gray-200 rounded mb-12"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-4xl font-serif mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Post not found
          </h1>
          <button
            onClick={onBackClick}
            className="text-gray-600 hover:text-black"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (!isAuthenticated) {
      onSignInClick();
      return;
    }
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleDelete = () => {
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteConfirm();
    setDeleteConfirm(false);
  };

  const estimateReadTime = (content) => {
    if (!content) return 0;
    const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
    return Math.ceil(wordCount / 200);
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return then.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="font-serif text-lg font-normal italic tracking-wide hover:opacity-70 transition-opacity cursor-pointer"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              LUMEN EDITORIAL
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => onNavigate("home")}
                className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
              >
                Feed
              </button>
              <button
                onClick={() => onNavigate("authors")}
                className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
              >
                Authors
              </button>
              <a
                href="#"
                className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
              >
                Series
              </a>
              <button
                onClick={() => onNavigate("about")}
                className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
              >
                About
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 text-gray-700 hover:text-black">
                <Search className="w-4 h-4" />
              </button>
              {isAuthenticated ? (
                <button
                  onClick={onWriteClick}
                  className="px-4 py-2 bg-black text-white text-xs font-medium rounded-sm hover:bg-black/90 hidden md:block"
                >
                  WRITE
                </button>
              ) : (
                <button
                  onClick={onSignInClick}
                  className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
                >
                  Sign in
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs uppercase tracking-widest font-medium text-[#C5A059]">
              {post.tags?.[0] || "EDITORIAL"}
            </span>
            <span className="text-xs text-gray-600">
              {estimateReadTime(post.content)} MIN READ
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl font-serif font-normal mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-xl text-gray-600 mb-8">{post.subtitle}</p>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-12 rounded-sm overflow-hidden shadow-lg">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Author Byline */}
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium">
                {post.author?.name?.charAt(0) || "A"}
              </div>
              <div className="text-left">
                <button
                  onClick={() => onAuthorClick(post.author?.username)}
                  className="text-sm font-medium hover:text-[#C5A059] transition-colors"
                >
                  {post.author?.name || "Anonymous"}
                </button>
                <p className="text-xs text-gray-600">
                  {getRelativeTime(post.createdAt)}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 border border-black text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition-colors">
              Follow
            </button>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12 text-lg leading-relaxed text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Engagement Row */}
        <div className="border-t border-b border-gray-200 py-6 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isLiked ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              {likeCount}
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
              <MessageCircle className="w-5 h-5" />
              {post.comments?.length || 0}
            </button>
            <button className="text-gray-700 hover:text-black">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="text-gray-700 hover:text-black">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {isOwner && (
            <div className="flex items-center gap-4">
              <button
                onClick={onEditClick}
                className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-gray-700 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <h2
            className="text-2xl font-serif font-normal mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Perspectives
          </h2>

          {/* Comment Input */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <input
              type="text"
              placeholder="Add to the conversation..."
              className="w-full px-4 py-3 border border-gray-300 rounded-sm outline-none focus:border-black text-sm"
            />
            <button className="mt-3 px-6 py-2 bg-black text-white text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-black/90">
              Respond
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments?.map((comment) => (
              <div
                key={comment.id}
                className="pb-6 border-b border-gray-200 last:border-0"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-600">
                        {getRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{comment.text}</p>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <button className="hover:text-black">Reply</button>
                      <button className="hover:text-black">Like</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {post.comments && post.comments.length > 0 && (
            <button className="w-full py-4 text-center text-sm text-gray-600 hover:text-black font-medium">
              Show more responses
            </button>
          )}
        </section>
      </article>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-8 max-w-md shadow-2xl">
            <h2
              className="text-xl font-serif mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Delete this post?
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. The post and all associated comments
              will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div
              className="font-serif text-lg font-normal italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              LUMEN EDITORIAL
            </div>
            <div className="flex gap-6 text-xs text-gray-600">
              <a href="#" className="hover:text-black">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-black">
                Terms of Service
              </a>
              <a href="#" className="hover:text-black">
                Press Kit
              </a>
              <a href="#" className="hover:text-black">
                Newsletter
              </a>
              <a href="#" className="hover:text-black">
                Contact
              </a>
            </div>
          </div>
          <div className="text-xs text-gray-600 border-t border-gray-200 pt-8">
            © 2024 Lumen Editorial. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
