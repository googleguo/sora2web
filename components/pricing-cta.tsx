import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/link"

type PricingCTAProps = {
  dict: any
}

export function PricingCTA({ dict }: PricingCTAProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          {dict.PricingCTA?.title || "Create Professional Videos"}
          <br />
          {dict.PricingCTA?.titleLine2 || "with VideoForge AI"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {dict.PricingCTA?.description ||
            "Transform your ideas into stunning videos with VideoForge AI's advanced technology. Whether you're a content creator, marketer, or business, you have everything you need for professional video creation. Discover why VideoForge AI is the preferred choice for content creators worldwide."}
        </p>
        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
          <Link href="/generate">{dict.PricingCTA?.button || "Start Creating with VideoForge AI"}</Link>
        </Button>
      </div>
    </section>
  )
}
