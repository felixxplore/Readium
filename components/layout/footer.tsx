import Link from 'next/link'

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold">Readium</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Readium
          </p>
        </div>
      </div>
    </footer>
  )
}
