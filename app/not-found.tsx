import Link from 'next/link'
import { ArrowLeft, Compass, Home, PenSquare, Search } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

const quickLinks = [
  {
    href: '/',
    label: 'Go Home',
    description: 'Return to the main reading feed.',
    icon: Home,
  },
  {
    href: '/search',
    label: 'Search Stories',
    description: 'Explore articles, people, and tags.',
    icon: Search,
  },
  {
    href: '/write',
    label: 'Start Writing',
    description: 'Turn the detour into a fresh draft.',
    icon: PenSquare,
  },
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_48%),radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.12),transparent_35%)]" />

        <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border bg-background/90 p-8 shadow-sm backdrop-blur sm:p-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <Compass className="size-3.5" />
                Lost In The Stacks
              </div>

              <p className="text-sm font-medium text-primary">Error 404</p>
              <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                This page slipped out of the publication.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                The link may be outdated, the story may have moved, or the profile you opened does not
                exist yet. Let&apos;s get you back to something worth reading.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/">
                  <Button size="lg" className="gap-2 rounded-full px-6">
                    <Home className="size-4" />
                    Back to Home
                  </Button>
                </Link>
                <Link href="/search">
                  <Button size="lg" variant="outline" className="gap-2 rounded-full px-6">
                    <Search className="size-4" />
                    Browse Search
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {quickLinks.map(link => {
                const Icon = link.icon

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group block rounded-[1.75rem] border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold">{link.label}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                      <ArrowLeft className="mt-1 size-4 rotate-180 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}

              <div className="rounded-[1.75rem] border border-dashed bg-muted/30 p-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Editor&apos;s Note
                </p>
                <p className="mt-3 font-serif text-2xl font-semibold">
                  Good reading journeys always have a way back.
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  If this happened from a profile link, the user may not have a public profile page yet.
                  If it came from a story URL, the article may be missing from the current demo data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
