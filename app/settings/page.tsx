'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserAvatar } from '@/components/shared/user-avatar'
import { PageTransition } from '@/components/shared/page-transition'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { updateProfile } from '@/lib/features/auth/auth-slice'
import { cn } from '@/lib/utils'

const tabs = ['Profile', 'Account', 'Notifications']

export default function SettingsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const [activeTab, setActiveTab] = useState('Profile')

  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-2xl font-bold">Sign in required</h1>
            <p className="text-muted-foreground">You need to be signed in to access settings.</p>
          </div>
        </main>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSuccessMessage('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    dispatch(updateProfile({ name, bio, email }))
    setIsSaving(false)
    setSuccessMessage('Profile updated successfully!')

    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleAvatarChange = () => {
    const url = window.prompt('Enter new avatar URL')
    if (url) {
      dispatch(updateProfile({ avatar: url }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTransition>
          <h1 className="mb-8 font-serif text-3xl font-bold">Settings</h1>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <nav className="flex gap-2 lg:w-48 lg:flex-col lg:gap-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors',
                    activeTab === tab
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'Profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <UserAvatar src={user.avatar} name={user.name} size="xl" className="size-20" />
                    <div>
                      <Button variant="outline" size="sm" onClick={handleAvatarChange}>
                        Change avatar
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Recommended: Square image, at least 400x400px
                      </p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-sm text-muted-foreground">
                      Brief description for your profile. Max 160 characters.
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center gap-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save changes'}
                    </Button>
                    {successMessage && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-primary"
                      >
                        {successMessage}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'Account' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username
                    </label>
                    <Input
                      id="username"
                      value={user.username}
                      disabled
                      className="opacity-60"
                    />
                    <p className="text-sm text-muted-foreground">
                      Username cannot be changed.
                    </p>
                  </div>

                  {/* Danger Zone */}
                  <div className="rounded-lg border border-destructive/50 p-6">
                    <h3 className="mb-2 font-medium text-destructive">Danger Zone</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete account
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <NotificationToggle
                      label="Email notifications"
                      description="Get notified about new followers and responses"
                      defaultChecked
                    />
                    <NotificationToggle
                      label="Weekly digest"
                      description="Get a weekly summary of trending stories"
                      defaultChecked
                    />
                    <NotificationToggle
                      label="Recommendations"
                      description="Personalized story recommendations based on your reading"
                    />
                    <NotificationToggle
                      label="Marketing emails"
                      description="Product updates and announcements from Readium"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}

function NotificationToggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  )
}
