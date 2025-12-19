import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getDictionary } from "@/lib/i18n/get-dictionary"

function SuccessContent({ dict }: { dict: any }) {
  return (
    <div className="min-h-screen bg-background">
      <Header dict={dict} />
      <main className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-balance">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for subscribing to SoraVideo AI. Your account has been upgraded and credits are now available.
          </p>

          <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-2">What's Next?</h2>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Your credits have been added to your account</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>You can now generate videos with your subscription</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>A confirmation email has been sent to your inbox</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-500">
              <Link href="/generate">
                Start Creating Videos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  )
}

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent dict={dict} />
    </Suspense>
  )
}
