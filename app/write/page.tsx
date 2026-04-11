'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/shared/page-transition'
import { useAppSelector } from '@/lib/store/hooks'
import { createPost } from '@/lib/api/posts'

const DRAFT_KEY = 'readium-draft'

interface Draft {
  title: string
  subtitle: string
  content: string
  coverImage: string
  tags: string[]
  savedAt: string
}

export default function WritePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState('')

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY)
    if (savedDraft) {
      try {
        const draft: Draft = JSON.parse(savedDraft)
        setTitle(draft.title || '')
        setSubtitle(draft.subtitle || '')
        setContent(draft.content || '')
        setCoverImage(draft.coverImage || '')
        setTags(draft.tags || [])
        setLastSaved(new Date(draft.savedAt))
      } catch {
        // Invalid draft, ignore
      }
    }
  }, [])

  // Auto-save draft
  const saveDraft = useCallback(() => {
    const draft: Draft = {
      title,
      subtitle,
      content,
      coverImage,
      tags,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setLastSaved(new Date())
  }, [title, subtitle, content, coverImage, tags])

  useEffect(() => {
    const timer = setTimeout(saveDraft, 2000)
    return () => clearTimeout(timer)
  }, [saveDraft])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add a title and content to your story.')
      return
    }

    setIsPublishing(true)
    setError('')

    try {
      const post = await createPost({
        title: title.trim(),
        content,
      })

      localStorage.removeItem(DRAFT_KEY)
      router.push(`/article/${post.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish story')
      setIsPublishing(false)
    }
  }

  const handleCoverImageChange = () => {
    const url = window.prompt('Enter image URL for cover image')
    if (url) {
      setCoverImage(url)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-2xl font-bold">Sign in to write</h1>
            <p className="text-muted-foreground">You need to be signed in to create a story.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Header for Write Page */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl font-bold">Draft</span>
            {lastSaved && (
              <span className="text-sm text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || !title.trim()}
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <PageTransition>
          <div className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              {coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={coverImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setCoverImage('')}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={handleCoverImageChange}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed py-12 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="size-5" />
                  <span>Add a cover image</span>
                </button>
              )}
            </motion.div>

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent font-serif text-4xl font-bold leading-tight placeholder:text-muted-foreground/50 focus:outline-none"
            />

            {/* Subtitle */}
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Subtitle (optional)"
              className="w-full bg-transparent text-xl text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag..."
                  className="w-24 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none"
                />
              )}
            </div>

            {/* Editor */}
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Tell your story..."
            />
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
