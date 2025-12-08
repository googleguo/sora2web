"use client"

import { Link } from "@/lib/i18n/link"
import { Button } from "@/components/ui/button"
import { Sparkles, User } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { LanguageSwitcher } from "@/components/language-switcher"

type HeaderClientProps = {
  dict?: any
  user?: any
}

const defaultHeader = {
  brand: "VideoForge AI",
  examples: "Examples",
  reviews: "Reviews",
  faq: "FAQ",
  pricing: "Pricing",
  history: "History",
  videoGenerator: "Video Generator",
  dashboard: "Dashboard",
  login: "Login",
  getStarted: "Get Started",
  generate: "Generate",
}

export function HeaderClient({ dict, user }: HeaderClientProps) {
  const header = dict?.Header || defaultHeader

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {header.brand}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/#examples"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {header.examples}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {header.reviews}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {header.faq}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {header.pricing}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link
            href="/generate"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {header.videoGenerator}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {header.dashboard}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {user ? (
            <>
              <Button
                asChild
                size="sm"
                className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <Link href="/generate">{header.generate}</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="md:hidden bg-transparent">
                <Link href="/dashboard">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                <Link href="/auth/login">{header.login}</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <Link href="/generate">{header.getStarted}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
