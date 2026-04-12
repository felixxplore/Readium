'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { stripHtml } from '@/lib/utils'
import type { ArticlePreview } from '@/types'
import { cn } from '@/lib/utils'

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'

function getCoverImage(src: string | null | undefined): string {
  if (src && src.trim()) {
    return src
  }
  return PLACEHOLDER_IMAGE
}

interface ArticleCardProps {
  article: ArticlePreview
  onSave?: (id: string) => void
  featured?: boolean
}

export function ArticleCard({ article, onSave, featured = false }: ArticleCardProps) {

  console.log("from artical card : ", article);

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative overflow-hidden rounded-xl"
      >
        <Link href={`/article/${article.slug}`} className="block">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={getCoverImage(article.coverImage)}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="mb-3 flex items-center gap-2">
              <UserAvatar src={article.author.avatar} name={article.author.name} size="sm" />
              <span className="text-sm font-medium">{article.author.name}</span>
            </div>
            <h2 className="mb-2 font-serif text-2xl font-bold leading-tight text-balance sm:text-3xl">
              {article.title}
            </h2>
            <p className="mb-4 line-clamp-2 text-sm text-white/80 sm:text-base">
              {stripHtml(article.subtitle)}
            </p>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group flex gap-4 border-b py-6 sm:gap-6"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/profile/${article.author.username}`}
          className="mb-2 flex items-center gap-2"
        >
          <UserAvatar src={article.author.avatar} name={article.author.name} size="sm" />
          <span className="text-sm font-medium hover:underline">{article.author.name}</span>
 
        </Link>

        <Link href={`/article/${article.slug}`} className="group/link">
          <h2 className="mb-1 font-serif text-lg font-bold leading-tight text-balance group-hover/link:text-primary sm:text-xl">
            {article.title}
          </h2>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground sm:text-base">
            {stripHtml(article.subtitle || article.excerpt)}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{article.readTime} min read</span>
            {article.tags[0] && (
              <>
                <span className="hidden sm:inline">·</span>
                <Link
                  href={`/search?tag=${article.tags[0]}`}
                  className="hidden rounded-full bg-muted px-2.5 py-0.5 text-xs hover:bg-muted/80 sm:inline-block"
                >
                  {article.tags[0]}
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSave?.(article.id)}
            aria-label={article.isSaved ? 'Remove from saved' : 'Save article'}
          >
            {article.isSaved ? (
              <BookmarkCheck className="size-4 text-primary" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
        </div>
      </div>

      <Link
        href={`/article/${article.slug}`}
        className="hidden flex-shrink-0 sm:block"
      >
        <div className="relative h-28 w-40 overflow-hidden rounded-md">
          <Image
            src={getCoverImage(article.coverImage)}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
    </motion.article>
  )
}
