'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Edit, Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { NotificationBell } from '@/components/shared/notification-bell'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { logout } from '@/lib/features/auth/auth-slice'
import { toggleMobileMenu, closeMobileMenu, openAuthModal } from '@/lib/features/ui/ui-slice'
import { clearStoredSession } from '@/lib/auth/session'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const { mobileMenuOpen } = useAppSelector(state => state.ui)

  const isWritePage = pathname?.startsWith('/write')

  const handleLogout = () => {
    clearStoredSession()
    dispatch(logout())
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => dispatch(closeMobileMenu())}>
          <motion.span
            className="font-serif text-2xl font-bold text-foreground"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Readium
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/search">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="size-5" />
            </Button>
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link href="/write">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Edit className="size-4" />
                  <span>Write</span>
                </Button>
              </Link>

              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserAvatar src={user.avatar} name={user.name} size="sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex flex-col items-start gap-1">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">@{user.username}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/write">Write a story</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => dispatch(openAuthModal('login'))}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => dispatch(openAuthModal('signup'))}>
                Get started
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => dispatch(toggleMobileMenu())}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileMenuOpen ? 'auto' : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'overflow-hidden border-t bg-background md:hidden',
          !mobileMenuOpen && 'pointer-events-none'
        )}
      >
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/search"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            onClick={() => dispatch(closeMobileMenu())}
          >
            <Search className="size-4" />
            Search
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                href="/write"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => dispatch(closeMobileMenu())}
              >
                <Edit className="size-4" />
                Write a story
              </Link>
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => dispatch(closeMobileMenu())}
              >
                <UserAvatar src={user.avatar} name={user.name} size="sm" />
                <span>{user.name}</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Settings
              </Link>
              <button
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted"
                onClick={() => {
                  handleLogout()
                  dispatch(closeMobileMenu())
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  dispatch(openAuthModal('login'))
                  dispatch(closeMobileMenu())
                }}
              >
                Sign in
              </Button>
              <Button
                onClick={() => {
                  dispatch(openAuthModal('signup'))
                  dispatch(closeMobileMenu())
                }}
              >
                Get started
              </Button>
            </div>
          )}
        </nav>
      </motion.div>
    </header>
  )
}
