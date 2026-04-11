'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { useAppSelector } from '@/lib/store/hooks'
import { cn } from '@/lib/utils'

interface CommentFormProps {
  onSubmit: (content: string) => void | Promise<void>
  onCancel?: () => void
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
  showAvatar?: boolean
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder = 'What are your thoughts?',
  submitLabel = 'Respond',
  autoFocus = false,
  showAvatar = false,
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(autoFocus)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useAppSelector(state => state.auth)

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      try {
        setIsSubmitting(true)
        await onSubmit(content.trim())
        setContent('')
        setIsFocused(false)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        {showAvatar && user && (
          <UserAvatar src={user.avatar} name={user.name} size="md" />
        )}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            rows={1}
            disabled={isSubmitting}
            className={cn(
              'w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none',
              isFocused ? 'min-h-[100px]' : 'min-h-[40px]'
            )}
          />
        </div>
      </div>

      {isFocused && (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setContent('')
              setIsFocused(false)
              onCancel?.()
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : submitLabel}
          </Button>
        </div>
      )}
    </form>
  )
}
