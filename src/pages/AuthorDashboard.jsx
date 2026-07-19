"use client";

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  MessageCircle,
  Clock,
  Edit2,
  Trash2,
} from "lucide-react";

export default function AuthorDashboard({
  posts = [],
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  authorName = "Author",
  searchQuery = "",
  onSearch = () => {},
  onLoadMore = () => {},
  onEditPost = () => {},
  onDeletePost = () => {},
  onPostClick = () => {},
}) {
  const [activeTab, setActiveTab] = useState("published");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearch(value);
  };

  const handleDeleteClick = (postId) => {
    setDeleteConfirm(postId);
  };

  const handleConfirmDelete = (postId) => {
    onDeletePost(postId);
    setDeleteConfirm(null);
  };

  const estimateReadTime = (content) => {
    const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
    return Math.ceil(wordCount / 200);
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-sm border border-gray-200 shadow-[0px_20px_40px_rgba(0,0,0,0.05)] p-6 flex gap-6 animate-pulse">
      <div className="w-32 h-24 bg-gray-200 rounded-sm flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  const StoryCard = ({ post }) => (
    <div className="group bg-white rounded-sm border border-gray-200 shadow-[0px_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0px_20px_40px_rgba(0,0,0,0.1)] transition-all p-6 flex gap-6">
      {/* Thumbnail */}
      <div className="w-32 h-24 flex-shrink-0 rounded-sm overflow-hidden bg-gray-100">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#f3f3f3] to-[#e8e8e8]"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-between">
        <div className="flex-1">
          {/* Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest font-medium px-2 py-1 rounded-sm bg-[#C5A059] text-white">
              PUBLISHED
            </span>
            <span className="text-xs text-gray-600">
              Modified {getRelativeTime(post.updatedAt)}
            </span>
          </div>

          {/* Title */}
          <button
            onClick={() => onPostClick(post.id)}
            className="block text-xl font-serif font-normal mb-2 hover:text-[#C5A059] transition-colors text-left"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {post.title}
          </button>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-1 mb-3">
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{(post.likeCount || 0).toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{post.commentCount || 0} comments</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{estimateReadTime(post.content || "")} min read</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditPost(post.id)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-gray-600 hover:text-black" />
          </button>
          <button
            onClick={() => handleDeleteClick(post.id)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-56 h-screen bg-[#f3f3f3] border-r border-gray-200 p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-12">
          <div
            className="font-serif text-2xl font-normal italic mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Lumen
          </div>
          <div className="text-xs uppercase tracking-widest font-medium text-gray-600">
            Editorial Suite
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {[
            { label: "Dashboard", icon: "▦" },
            { label: "Analytics", icon: "📊" },
            { label: "Stories", icon: "📝", active: true },
            { label: "Library", icon: "📚" },
            { label: "Settings", icon: "⚙" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                item.active
                  ? "bg-[#C5A059]/20 text-black"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
              {authorName.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium">{authorName}</div>
              <div className="text-xs text-gray-600">Editor in Chief</div>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-black text-white text-xs font-medium rounded-sm hover:bg-black/90 transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-56">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1
                className="text-4xl font-serif font-normal"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                My Stories
              </h1>
            </div>

            {/* Tabs and Search */}
            <div className="flex items-center justify-between">
              <div className="flex gap-8 border-b border-gray-200">
                {[
                  { id: "published", label: "Published", count: posts.length },
                  { id: "drafts", label: "Drafts", count: 0, disabled: true },
                  { id: "archive", label: "Archive", disabled: true },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => !tab.disabled && setActiveTab(tab.id)}
                    disabled={tab.disabled}
                    className={`px-1 py-3 text-sm font-medium uppercase tracking-widest ${
                      activeTab === tab.id
                        ? "text-black border-b-2 border-black"
                        : tab.disabled
                          ? "text-gray-400 cursor-not-allowed opacity-60"
                          : "text-gray-600 hover:text-black"
                    } transition-colors`}
                    title={tab.disabled ? "Coming soon" : ""}
                  >
                    {tab.label} {tab.count !== undefined && `(${tab.count})`}
                  </button>
                ))}
              </div>

              <div className="relative w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearch}
                  placeholder="Search stories..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stories List */}
        <div className="p-6 space-y-4">
          {isLoading && !posts.length ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <div key={post.id}>
                  <StoryCard post={post} />

                  {/* Delete Confirmation Modal */}
                  {deleteConfirm === post.id && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-sm p-8 max-w-md shadow-2xl">
                        <h2
                          className="text-xl font-serif mb-4"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          Delete "{post.title}"?
                        </h2>
                        <p className="text-gray-600 text-sm mb-6">
                          This action cannot be undone. The post and all
                          associated comments will be permanently removed.
                        </p>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(post.id)}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                    className="px-8 py-2 border border-black text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isLoadingMore ? "Loading..." : "Load More Stories"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h3
                className="text-2xl font-serif font-normal mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                You haven&apos;t written anything yet
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Your published stories will appear here once you create them
                from the main feed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
