"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Eye, Settings, X, Plus, AlertCircle } from "lucide-react";

export default function PostEditor({
  mode = "create",
  initialData = null,
  authorName = "Anonymous",
  isSubmitting = false,
  error = null,
  onSubmit = () => {},
  onCancel = () => {},
  onDashboardClick = () => {},
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("DESIGN");
  const [showTagInput, setShowTagInput] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [missingMetadata, setMissingMetadata] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content || "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.split(/\s+/).filter((w) => w.length > 0).length;
      setWordCount(words);
      setReadTime(Math.ceil(words / 200));
    },
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setExcerpt(initialData.excerpt || "");
      setCoverImage(initialData.coverImage || "");
      setCoverImageUrl(initialData.coverImage || "");
      setTags(initialData.tags || []);
      setCategory(initialData.category || "DESIGN");

      // Initialize editor content
      if (editor) {
        editor.commands.setContent(initialData.content || "");
      }
    }
  }, [initialData, mode, editor]);

  useEffect(() => {
    setMissingMetadata(!coverImage || tags.length === 0 || !category);
  }, [coverImage, tags, category]);

  const validateForm = () => {
    const newErrors = {};
    if (!title || title.length < 3 || title.length > 200) {
      newErrors.title = "Title must be 3-200 characters";
    }
    if (!editor || editor.getText().length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }
    if (subtitle && subtitle.length > 255) {
      newErrors.subtitle = "Subtitle must be 255 characters or less";
    }
    if (excerpt && excerpt.length > 500) {
      newErrors.excerpt = "Excerpt must be 500 characters or less";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCoverImageBlur = () => {
    if (coverImageUrl.trim()) {
      setCoverImage(coverImageUrl);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage("");
    setCoverImageUrl("");
  };

  const handleSubmit = () => {
    if (validateForm() && editor) {
      onSubmit({
        title,
        subtitle,
        content: editor.getHTML(),
        excerpt,
        coverImage,
        tags,
        category,
      });
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-black/5">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            ← Back
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              Draft saved
            </div>
            <button
              onClick={onDashboardClick}
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black transition-colors"
            >
              My Stories
            </button>
            <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`text-gray-600 hover:text-black relative transition-colors ${
                  showSettings ? "text-black" : ""
                }`}
              >
                <Settings className="w-4 h-4" />
                {missingMetadata && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-black/90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting && <span className="animate-spin">⟳</span>}
            {mode === "edit" ? "UPDATE" : "PUBLISH"}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Settings Drawer */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setShowSettings(false)}
          ></div>
          <div className="fixed right-0 top-16 bottom-0 w-full md:w-96 bg-white border-l border-gray-200 z-30 overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-medium">
                  Post Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-600 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Cover Image
                </label>
                {coverImage ? (
                  <div className="mb-4 rounded-sm overflow-hidden bg-gray-200 aspect-video">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setCoverImage("");
                        setCoverImageUrl("");
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 rounded-sm bg-gray-100 aspect-video flex items-center justify-center text-gray-400 text-sm">
                    Preview
                  </div>
                )}
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  onBlur={handleCoverImageBlur}
                  placeholder="Paste image URL"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400 outline-none focus:border-black mb-2"
                />
                {coverImage && (
                  <button
                    onClick={handleRemoveCoverImage}
                    className="text-xs text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Tags</label>
                  {tags.length >= 5 && (
                    <span className="text-xs text-red-600">Max 5</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(idx)}
                        className="text-gray-500 hover:text-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {!showTagInput ? (
                  <button
                    onClick={() => setShowTagInput(true)}
                    disabled={tags.length >= 5}
                    className="text-xs text-gray-600 hover:text-black flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" /> Add Tag
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      placeholder="Add tag..."
                      className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded-sm outline-none focus:border-black"
                      autoFocus
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-1 bg-black text-white text-xs rounded-sm hover:bg-black/90"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-black"
                >
                  <option>DESIGN</option>
                  <option>TECHNOLOGY</option>
                  <option>CULTURE</option>
                  <option>ESSAYS</option>
                  <option>ARCHITECTURE</option>
                </select>
              </div>

              {/* Excerpt */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Excerpt</label>
                  <span className="text-xs text-gray-500">
                    {excerpt.length}/500
                  </span>
                </div>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary for search engines and previews..."
                  maxLength="500"
                  className="w-full h-24 text-sm px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400 outline-none focus:border-black resize-none"
                />
                {errors.excerpt && (
                  <p className="text-red-600 text-xs mt-2">{errors.excerpt}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          showSettings ? "opacity-60 blur-sm" : "opacity-100 blur-0"
        }`}
        style={{ pointerEvents: showSettings ? "none" : "auto" }}
      >
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Narrative"
            className="w-full text-5xl md:text-6xl font-serif font-normal leading-tight mb-2 placeholder-gray-300 outline-none border-none bg-transparent focus:outline-none"
            style={{ fontFamily: "var(--font-serif)" }}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mb-4">{errors.title}</p>
          )}

          {/* Byline */}
          <div className="text-sm text-gray-600 mb-8 border-b border-gray-200 pb-4">
            By {authorName} • {today}
          </div>

          {/* Subtitle */}
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Add a subtitle (optional)"
            maxLength="255"
            className="w-full text-lg font-serif text-gray-600 mb-2 placeholder-gray-400 outline-none border-none bg-transparent focus:outline-none"
            style={{ fontFamily: "var(--font-serif)" }}
          />
          {subtitle.length > 240 && (
            <p className="text-xs text-gray-500 mb-8">
              {255 - subtitle.length} characters left
            </p>
          )}

          {/* Tiptap Editor */}
          <style>{`
            .tiptap {
              outline: none;
              font-size: 1.125rem;
              line-height: 1.75;
              min-height: 24rem;
              color: #1a1c1c;
            }

            .tiptap p,
            .tiptap li,
            .tiptap blockquote {
              margin: 0.5rem 0;
            }

            .tiptap h1,
            .tiptap h2,
            .tiptap h3 {
              font-family: 'Libre Caslon Text', serif;
              font-weight: 500;
              margin: 1rem 0 0.5rem 0;
              line-height: 1.4;
            }

            .tiptap h2 {
              font-size: 1.75rem;
            }

            .tiptap h3 {
              font-size: 1.5rem;
            }

            .tiptap blockquote {
              border-left: 3px solid #C5A059;
              padding-left: 1.25rem;
              font-style: italic;
              color: #666;
              margin: 0.75rem 0;
            }

            .tiptap ul,
            .tiptap ol {
              padding-left: 1.5rem;
              margin: 0.5rem 0;
            }

            .tiptap li {
              margin: 0.25rem 0;
              line-height: 1.7;
            }

            .tiptap strong {
              font-weight: 600;
            }

            .tiptap em {
              font-style: italic;
            }

            .tiptap p:first-child {
              margin-top: 0;
            }
          `}</style>
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none focus:outline-none"
          />
          {errors.content && (
            <p className="text-red-600 text-sm mb-4 mt-4">{errors.content}</p>
          )}

          {/* Floating Toolbar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-sm shadow-lg border border-gray-200 flex items-center gap-2 px-4 py-3 z-20">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-2 rounded transition-colors ${
                editor.isActive("bold")
                  ? "bg-accent text-black"
                  : "hover:bg-gray-100 text-gray-700 hover:text-black"
              }`}
              title="Bold (Ctrl+B)"
            >
              <span className="font-bold text-sm">B</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-2 rounded transition-colors ${
                editor.isActive("italic")
                  ? "bg-accent text-black"
                  : "hover:bg-gray-100 text-gray-700 hover:text-black"
              }`}
              title="Italic (Ctrl+I)"
            >
              <span className="italic text-sm">I</span>
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={!editor.can().chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded transition-colors ${
                editor.isActive("blockquote")
                  ? "bg-accent text-black"
                  : "hover:bg-gray-100 text-gray-700 hover:text-black"
              }`}
              title="Quote"
            >
              "
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              disabled={
                !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-accent text-black"
                  : "hover:bg-gray-100 text-gray-700 hover:text-black"
              }`}
              title="Heading"
            >
              H
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              className={`p-2 rounded transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-accent text-black"
                  : "hover:bg-gray-100 text-gray-700 hover:text-black"
              }`}
              title="Bullet list"
            >
              •
            </button>
          </div>

          {/* Status Bar */}
          <div className="mt-16 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <div>Auto-save enabled</div>
            <div className="flex gap-6">
              <span>{wordCount} words</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
