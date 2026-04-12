'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'pulse'
  text?: string
  fullscreen?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function Loader({
  size = 'md',
  variant = 'default',
  text,
  fullscreen = false,
  className = '',
}: LoaderProps) {
  const loaderContent = (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {variant === 'default' && (
        <div className={cn('relative', sizeStyles[size])}>
          {/* Outer rotating circle */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-1 rounded-full border border-primary/30"
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )}

      {variant === 'minimal' && (
        <div className={cn('relative', sizeStyles[size])}>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-muted"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-0 left-1/2 w-1 h-1 -translate-x-1/2 rounded-full bg-primary" />
          </motion.div>
        </div>
      )}

      {variant === 'pulse' && (
        <motion.div
          className={cn(
            'rounded-full bg-primary/20',
            sizeStyles[size]
          )}
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {text && (
        <motion.p
          className="text-sm font-medium text-muted-foreground"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm"
      >
        {loaderContent}
      </motion.div>
    )
  }

  return loaderContent
}

/**
 * Inline loader for use within content areas
 */
export function InlineLoader({
  text = 'Loading...',
  size = 'sm',
}: {
  text?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={cn('rounded-full border-2 border-transparent border-t-primary', sizeStyles[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

/**
 * Skeleton loader for placeholder content
 */
export function SkeletonLoader({ 
  count = 3,
  className = '',
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="h-12 rounded-lg bg-muted"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}
