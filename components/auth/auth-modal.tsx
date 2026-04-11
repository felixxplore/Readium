'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { closeAuthModal, openAuthModal } from '@/lib/features/ui/ui-slice'

export function AuthModal() {
  const dispatch = useAppDispatch()
  const { authModalOpen, authModalView } = useAppSelector(state => state.ui)

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(closeAuthModal())
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [dispatch])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [authModalOpen])

  const switchView = () => {
    dispatch(openAuthModal(authModalView === 'login' ? 'signup' : 'login'))
  }

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeAuthModal())}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md rounded-xl bg-background p-8 shadow-2xl">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(closeAuthModal())}
                className="absolute right-4 top-4"
              >
                <X className="size-5" />
              </Button>

              {/* Content */}
              <div className="text-center">
                <h2 className="mb-2 font-serif text-2xl font-bold">
                  {authModalView === 'login' ? 'Welcome back.' : 'Join Readium.'}
                </h2>
                <p className="mb-8 text-muted-foreground">
                  {authModalView === 'login'
                    ? 'Sign in to continue reading and writing.'
                    : 'Create an account to start writing and sharing your ideas.'}
                </p>
              </div>

              {authModalView === 'login' ? (
                <LoginForm onSuccess={() => dispatch(closeAuthModal())} />
              ) : (
                <SignupForm onSuccess={() => dispatch(closeAuthModal())} />
              )}

              {/* Switch View */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {authModalView === 'login' ? (
                  <>
                    No account?{' '}
                    <button onClick={switchView} className="text-primary hover:underline">
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={switchView} className="text-primary hover:underline">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
