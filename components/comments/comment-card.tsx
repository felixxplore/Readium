'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { CommentForm } from './comment-form'
import type { Comment, CommentReply } from '@/types'
import { cn } from '@/lib/utils'

// Format date in a stable way to avoid hydration mismatches
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`
}

interface CommentCardProps {
  comment: Comment
  onLike: (commentId: string) => void
  onReply: (commentId: string, content: string) => void
}

export function CommentCard({ comment, onLike, onReply }: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const formattedDate = formatDate(comment.createdAt)

  const handleReply = (content: string) => {
    onReply(comment.id, content)
    setShowReplyForm(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b py-6 last:border-b-0"
    >
      {/* Comment Header */}
      <div className="mb-3 flex items-start gap-3">
        <Link href={`/profile/${comment.author.username}`}>
          <UserAvatar src={comment.author.avatar} name={comment.author.name} size="md" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${comment.author.username}`}
              className="font-medium hover:underline"
            >
              {comment.author.name}
            </Link>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          <p className="mt-1 text-foreground">{comment.content}</p>

          {/* Comment Actions */}
          <div className="mt-3 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id)}
              className={cn(
                'h-auto gap-1.5 p-0 text-muted-foreground hover:text-foreground',
                comment.isLiked && 'text-primary'
              )}
            >
              <Heart
                className={cn(
                  'size-4',
                  comment.isLiked && 'fill-primary'
                )}
              />
              <span className="text-sm">{comment.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-auto gap-1.5 p-0 text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="size-4" />
              <span className="text-sm">Reply</span>
            </Button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleReply}
                onCancel={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
                submitLabel="Reply"
                autoFocus
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 border-l-2 border-muted pl-4">
              {comment.replies.map(reply => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ReplyCard({ reply }: { reply: CommentReply }) {
  const formattedDate = formatDate(reply.createdAt)

  return (
    <div className="flex gap-3">
      <Link href={`/profile/${reply.author.username}`}>
        <UserAvatar src={reply.author.avatar} name={reply.author.name} size="sm" />
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${reply.author.username}`}
            className="text-sm font-medium hover:underline"
          >
            {reply.author.name}
          </Link>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="mt-1 text-sm text-foreground">{reply.content}</p>
      </div>
    </div>
  )
}
