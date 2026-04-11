'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Article } from '@/types'

interface ArticleContentProps {
  article: Article
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Cover Image */}
      {article.coverImage && (
        <figure className="mb-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </figure>
      )}

      {/* Article Content */}
      <article
        className="prose-article font-serif"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t pt-6">
          {article.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full bg-muted px-4 py-1.5 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
