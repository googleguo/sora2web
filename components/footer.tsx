import Link from "@/lib/i18n/link"
import { Sparkles } from "lucide-react"

type FooterProps = {
  dict?: any
}

const defaultFooter = {
  brand: "SoraVideo AI",
  tagline: "Transform your ideas into stunning videos with AI",
  product: "Product",
  features: "Features",
  pricing: "Pricing",
  generate: "Generate Video",
  history: "History",
  legal: "Legal",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  refund: "Refund Policy",
  copyright: "© 2025 SoraVideo AI. All rights reserved.",
  disclaimer:
    "SoraVideo AI is an independent platform and is not affiliated with or endorsed by any AI model providers.",
}

export function Footer({ dict }: FooterProps) {
  const footer = dict?.Footer || defaultFooter

  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{footer.brand}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{footer.tagline}</p>
            <p className="text-sm text-primary">
              <a href="mailto:support@SoraVideo.ltd" className="hover:underline">
                support@SoraVideo.ltd
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{footer.product}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/generate" className="hover:text-foreground transition-colors">
                  {footer.generate}
                </Link>
              </li>
              <li>
                <Link href="/#examples" className="hover:text-foreground transition-colors">
                  {footer.features}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  {footer.pricing}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{footer.legal}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  {footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-foreground transition-colors">
                  {footer.refund}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>{footer.copyright}</p>
          <p className="mt-2 text-xs">{footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
