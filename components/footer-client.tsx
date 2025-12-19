"use client"

import { Link } from "@/lib/i18n/link"
import { Sparkles } from "lucide-react"

type FooterClientProps = {
  dict?: any
}

const defaultFooter = {
  brand: "SoraVideo AI",
  tagline: "Transform your ideas into stunning videos with AI",
  product: "Product",
  features: "Features",
  pricing: "Pricing",
  generate: "Generate",
  history: "History",
  legal: "Legal",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  refund: "Refund Policy",
  copyright: "All rights reserved.",
  disclaimer: "This service is not affiliated with OpenAI or Sora.",
}

export function FooterClient({ dict }: FooterClientProps) {
  const footer = dict?.Footer || defaultFooter

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Sparkles className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-lg sm:text-xl font-bold">{footer.brand}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">{footer.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{footer.product}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footer.features}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {footer.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href="/generate"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footer.generate}
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {footer.history}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{footer.legal}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {footer.refund}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} {footer.brand}. {footer.copyright}
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right">{footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
