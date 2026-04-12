'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/shared/page-transition'
import { Loader, InlineLoader } from '@/components/shared/loader'
import { useAppSelector } from '@/lib/store/hooks'
import { getPostById, updatePost } from '@/lib/api/posts'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const { id } = use(params)

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Load post for editing
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/write')
      return
    }

    const loadPost = async () => {
      try {
        setIsLoading(true)
        const post = await getPostById(Number(id))
        setTitle(post.title)
        setSubtitle(post.subtitle)
        setContent(post.content)
        setCoverImage(post.coverImage)
        setTags(post.tags)
      } catch (err) {
        console.error('Failed to load post:', err)
        setError('Failed to load post for editing')
        setTimeout(() => router.push('/profile'), 2000)
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [id, isAuthenticated, router])

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim()

    // Validation rules: must start with #, no spaces, max 5 tags
    if (!trimmedTag) {
      setError('Tag cannot be empty')
      return
    }

    if (!trimmedTag.startsWith('#')) {
      setError('Tags must start with #')
      return
    }

    if (trimmedTag.includes(' ')) {
      setError('Tags cannot contain spaces')
      return
    }

    if (trimmedTag.length < 2) { // # character alone is not valid
      setError('Tag must have at least one character after #')
      return
    }

    if (tags.length >= 5) {
      setError('Maximum 5 tags allowed')
      return
    }

    if (tags.includes(trimmedTag)) {
      setError('This tag already exists')
      return
    }

    setTags([...tags, trimmedTag])
    setTagInput('')
    setError('')
  }, [tagInput, tags])

  const handleRemoveTag = useCallback((indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }, [tags])

  const handlePublish = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!content.trim()) {
      setError('Content is required')
      return
    }

    setIsPublishing(true)
    setError('')

    try {
      const post = await updatePost(Number(id), {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content,
        coverImage,
        tags,
        excerpt: content.substring(0, 150),
      })

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
            <h1 className="mb-4 font-serif text-2xl font-bold">Sign in to edit</h1>
            <p className="text-muted-foreground">You need to be signed in to edit a story.</p>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <Loader size="lg" text="Loading post..." variant="default" />
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
            <span className="font-serif text-xl font-bold">Edit Post</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => router.back()}
            >
              Discard
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className={isPublishing ? 'gap-2' : ''}
            >
              {isPublishing ? (
                <>
                  <InlineLoader size="sm" text="" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <PageTransition>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive"
            >
              {error}
            </motion.div>
          )}

          {/* Cover Image */}
          {coverImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative mb-8 h-96 overflow-hidden rounded-lg"
            >
              <Image
                src={coverImage}
                alt="Cover image"
                fill
                className="object-cover"
              />
              <button
                onClick={() => setCoverImage('')}
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Add Cover Image Button */}
          <button
            onClick={handleCoverImageChange}
            className="mb-8 flex items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 text-muted-foreground hover:border-muted-foreground/70 hover:text-muted-foreground"
          >
            <ImagePlus className="h-5 w-5" />
            {coverImage ? 'Change cover image' : 'Add cover image'}
          </button>

          {/* Title */}
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mb-4 w-full bg-transparent font-serif text-4xl font-bold placeholder-muted-foreground outline-none"
          />

          {/* Subtitle */}
          <input
            type="text"
            placeholder="Write a subtitle... (optional)"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="mb-8 w-full bg-transparent text-xl text-muted-foreground placeholder-muted-foreground/50 outline-none"
          />

          {/* Tags Input */}
          <div className="mb-8 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tags... (e.g., #react)"
                value={tagInput}
                onChange={e => {
                  setTagInput(e.target.value)
                  setError('')
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="flex-1 rounded-lg border border-muted-foreground/50 bg-muted/50 px-3 py-2 text-sm placeholder-muted-foreground/50 outline-none focus:border-muted-foreground"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>

            {/* Display Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-primary/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          <TiptapEditor
            content={content}
            onChange={setContent}
          />
        </PageTransition>
      </main>
    </div>
  )
}
