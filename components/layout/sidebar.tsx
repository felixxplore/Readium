'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { trendingTags } from '@/lib/data/fake-articles'
import { useRecommendedUsers } from '@/lib/hooks/use-user'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { users: recommendedUsers } = useRecommendedUsers()

  return (
    <aside className="sticky top-20 hidden w-80 flex-shrink-0 lg:block">
      <div className="space-y-8">
        {/* Trending Topics */}
        <section>
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/search?tag=${tag}`}
                  className="inline-block rounded-full border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  {tag}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommended Authors */}
        <section>
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Who to follow
          </h3>
          <div className="space-y-4">
            {recommendedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <Link href="/profile">
                  <UserAvatar src={user.avatar} name={user.name} size="lg" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href="/profile"
                    className="block font-medium hover:underline"
                  >
                    {user.name}
                  </Link>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {user.bio}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  Follow
                </Button>
              </motion.div>
            ))}
          </div>
          <Link
            href="/search?type=people"
            className="mt-4 block text-sm text-primary hover:underline"
          >
            See more suggestions
          </Link>
        </section>

        {/* Footer Links */}
        <section className="text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/about" className="hover:text-foreground">Help</Link>
            <Link href="/about" className="hover:text-foreground">Status</Link>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/about" className="hover:text-foreground">Careers</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </section>
      </div>
    </aside>
  )
}
