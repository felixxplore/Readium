'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, BookmarkCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ArticleActionsProps {
  claps: number
  commentsCount: number
  isSaved: boolean
  isClapped: boolean
  onClap: () => void
  onSave: () => void
  onScrollToComments?: () => void
}

export function ArticleActions({
  claps,
  commentsCount,
  isSaved,
  isClapped,
  onClap,
  onSave,
  onScrollToComments,
}: ArticleActionsProps) {
  const [showClapAnimation, setShowClapAnimation] = useState(false)

  const handleClap = () => {
    onClap()
    setShowClapAnimation(true)
    setTimeout(() => setShowClapAnimation(false), 600)
  }

  return (
    <div className="sticky bottom-6 z-40 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 rounded-full border bg-background/95 px-4 py-2 shadow-lg backdrop-blur"
      >
        {/* Clap Button */}
        <div className="relative flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClap}
            className={cn(
              'gap-2 rounded-full',
              isClapped && 'text-primary'
            )}
          >
            <div className="relative">
              <Heart
                className={cn(
                  'size-5 transition-all',
                  isClapped && 'fill-primary text-primary'
                )}
              />
              <AnimatePresence>
                {showClapAnimation && (
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Heart className="size-5 fill-primary text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-sm">{claps}</span>
          </Button>
        </div>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Comments Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onScrollToComments}
          className="gap-2 rounded-full"
        >
          <MessageCircle className="size-5" />
          <span className="text-sm">{commentsCount}</span>
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Save Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="rounded-full"
          aria-label={isSaved ? 'Remove from saved' : 'Save article'}
        >
          {isSaved ? (
            <BookmarkCheck className="size-5 text-primary" />
          ) : (
            <Bookmark className="size-5" />
          )}
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: document.title,
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
            }
          }}
          className="rounded-full"
          aria-label="Share article"
        >
          <Share2 className="size-5" />
        </Button>
      </motion.div>
    </div>
  )
}

export function ArticleActionsSidebar({
  claps,
  commentsCount,
  isSaved,
  isClapped,
  onClap,
  onSave,
  onScrollToComments,
}: ArticleActionsProps) {
  return (
    <aside className="sticky top-24 hidden h-fit flex-col items-center gap-6 xl:flex">
      {/* Clap */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClap}
          className={cn(
            'rounded-full',
            isClapped && 'text-primary'
          )}
        >
          <Heart
            className={cn(
              'size-6 transition-all',
              isClapped && 'fill-primary'
            )}
          />
        </Button>
        <span className="text-sm text-muted-foreground">{claps}</span>
      </div>

      {/* Comments */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onScrollToComments}
          className="rounded-full"
        >
          <MessageCircle className="size-6" />
        </Button>
        <span className="text-sm text-muted-foreground">{commentsCount}</span>
      </div>

      {/* Save */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSave}
        className="rounded-full"
      >
        {isSaved ? (
          <BookmarkCheck className="size-6 text-primary" />
        ) : (
          <Bookmark className="size-6" />
        )}
      </Button>

      {/* Share */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
        }}
        className="rounded-full"
      >
        <Share2 className="size-6" />
      </Button>
    </aside>
  )
}
