import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ExamplesSection } from "@/components/examples-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { DisclaimerSection } from "@/components/disclaimer-section"
import { Footer } from "@/components/footer"
import { getDictionary } from "@/lib/i18n/get-dictionary"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <main className="min-h-screen">
      <Header dict={dict} />
      <HeroSection dict={dict} />
      <ExamplesSection dict={dict} />
      <TestimonialsSection dict={dict} />
      <FAQSection dict={dict} />
      <DisclaimerSection dict={dict} />
      <Footer dict={dict} />
    </main>
  )
}
