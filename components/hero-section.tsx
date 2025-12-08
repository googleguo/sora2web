import Link from "@/lib/i18n/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Play } from "lucide-react"

type HeroSectionProps = {
  dict: any
}

export function HeroSection({ dict }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-10" />
        <img
          src="/ocean-waves-aerial-view-dark-teal-water.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-5xl space-y-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm px-5 py-2 text-sm font-medium text-primary border border-primary/30 shadow-lg shadow-primary/10">
            <Sparkles className="h-4 w-4" />
            <span>Next Generation AI Video Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block text-balance">{dict.Hero.title}</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {dict.Hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              asChild
              size="lg"
              className="group text-base px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Link href="/generate">
                {dict.Hero.startCreating}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/50"
            >
              <Link href="/#examples">
                <Play className="mr-2 h-4 w-4" />
                {dict.Hero.watchDemo}
              </Link>
            </Button>
          </div>

          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50 animation-delay-150" />
              <span className="font-medium">Free trial available</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50 animation-delay-300" />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
    </section>
  )
}
