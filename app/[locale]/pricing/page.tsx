import { getDictionary } from "@/lib/i18n/get-dictionary"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingHero } from "@/components/pricing-hero"
import { PricingCards } from "@/components/pricing-cards"
import { PricingFAQ } from "@/components/pricing-faq"
import { PricingCTA } from "@/components/pricing-cta"

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-background">
      <Header dict={dict} />
      <main>
        <PricingHero dict={dict} />
        <PricingCards dict={dict} />
        <PricingFAQ dict={dict} />
        <PricingCTA dict={dict} />
      </main>
      <Footer dict={dict} />
    </div>
  )
}
