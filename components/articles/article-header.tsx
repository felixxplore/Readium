'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { stripHtml } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type { Article } from '@/types'

interface ArticleHeaderProps {
  article: Article
  isFollowing?: boolean
  onFollow?: () => void
  isOwnPost?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ArticleHeader({ article, isFollowing = false, onFollow, isOwnPost = false, onEdit, onDelete }: ArticleHeaderProps) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })


  const handleFollow = async () => {
    if (onFollow) {
      await onFollow()
      return
    }

    console.warn('ArticleHeader: No onFollow callback provided')
  };

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
          {stripHtml(article.subtitle)}
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

        {isOwnPost ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant={isFollowing ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleFollow}
            className="ml-auto"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>
    </motion.header>
  )
}
