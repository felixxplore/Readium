'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import type { Article } from '@/types'

interface ArticleHeaderProps {
  article: Article
  isFollowing?: boolean
  onFollow?: () => void
}

export function ArticleHeader({ article, isFollowing = false, onFollow }: ArticleHeaderProps) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="mb-4 font-serif text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl">
        {article.title}
      </h1>

      {article.subtitle && (
        <p className="mb-6 text-xl text-muted-foreground text-balance sm:text-2xl">
          {article.subtitle}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Link href={`/profile/${article.author.username}`} className="flex items-center gap-3">
          <UserAvatar src={article.author.avatar} name={article.author.name} size="lg" />
          <div>
            <p className="font-medium hover:underline">{article.author.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </Link>

        <Button
          variant={isFollowing ? 'secondary' : 'outline'}
          size="sm"
          onClick={onFollow}
          className="ml-auto"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    </motion.header>
  )
}
