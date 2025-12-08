type PricingHeroProps = {
  dict: any
}

export function PricingHero({ dict }: PricingHeroProps) {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-muted-foreground mb-4">{dict.Pricing?.badge || "VideoForge AI Pricing Plans"}</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
          {dict.Pricing?.title || "Simple and"}{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            {dict.Pricing?.titleHighlight }
          </span>{" "}
          {dict.Pricing?.titleEnd }
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {dict.Pricing?.subtitle ||
            "Choose a VideoForge AI subscription that matches your workflow. All tiers feature our breakthrough image-to-video AI with Complete Transparency. Adjust your plan anytime as requirements evolve."}
        </p>
      </div>
    </section>
  )
}
