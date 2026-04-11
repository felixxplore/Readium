'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { CommentCard } from './comment-card'
import { CommentForm } from './comment-form'
import { useComments } from '@/lib/hooks/use-comments'
import { useAppSelector } from '@/lib/store/hooks'

interface CommentSectionProps {
  articleId: string
}

export const CommentSection = forwardRef<HTMLElement, CommentSectionProps>(
  function CommentSection({ articleId }, ref) {
    const { comments, addComment, addReply, toggleLike } = useComments(articleId)
    const { isAuthenticated } = useAppSelector(state => state.auth)

    return (
      <section ref={ref} className="mt-16 border-t pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-6 font-serif text-2xl font-bold">
            Responses ({comments.length})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="mb-8 rounded-lg border bg-card p-4">
              <CommentForm
                onSubmit={addComment}
                showAvatar
                placeholder="What are your thoughts?"
              />
            </div>
          ) : (
            <div className="mb-8 rounded-lg border bg-muted/50 p-6 text-center">
              <p className="text-muted-foreground">
                Sign in to join the conversation
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-0">
            {comments.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onLike={toggleLike}
                onReply={addReply}
              />
            ))}

            {comments.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No responses yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </motion.div>
      </section>
    )
  }
)
