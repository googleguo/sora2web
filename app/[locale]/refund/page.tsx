import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertCircle, CheckCircle, Clock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const metadata = {
  title: "Refund Policy | VideoForge AI",
  description: "Our refund terms and eligibility criteria for VideoForge AI subscriptions",
}

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-background">
      <Header dict={dict} />
      <main className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-xl text-muted-foreground">Last Updated: December 4, 2025</p>
          </div>

          <div className="prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground max-w-none">
            <p className="text-lg">
              At VideoForge AI, we want you to be completely satisfied with your subscription. If you're not happy with
              our service, we offer refunds under the conditions outlined below.
            </p>

            <section className="mt-12">
              <h2 className="text-3xl font-semibold mb-6">Eligibility Criteria</h2>

              <div className="grid gap-6 md:grid-cols-2 not-prose mb-8">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Time Limitation</h3>
                      <p className="text-muted-foreground">
                        Refund requests must be submitted within{" "}
                        <strong className="text-foreground">72 hours (3 days)</strong> from your purchase completion.
                        Requests after this period will not be eligible for a refund.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Usage Limits</h3>
                      <p className="text-muted-foreground">
                        Your VideoForge AI account must have utilized{" "}
                        <strong className="text-foreground">fewer than 160 credits</strong> to qualify for a refund.
                        This ensures refunds are available to users who genuinely haven't benefited from the service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-semibold mb-6">How to Request a Refund</h2>

              <div className="bg-primary/10 p-6 rounded-lg not-prose mb-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Contact Method</h3>
                    <p className="text-muted-foreground mb-3">Email our support team at:</p>
                    <a
                      href="mailto:support@videoforge.ai"
                      className="text-primary hover:underline text-lg font-semibold"
                    >
                      support@videoforge.ai
                    </a>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Required Information</h3>
              <p>Please include the following details in your refund request:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your VideoForge AI account email address</li>
                <li>Full name associated with the account</li>
                <li>Transaction ID or order number</li>
                <li>Payment date</li>
                <li>Brief explanation for the refund request</li>
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-semibold mb-6">Processing Your Refund</h2>

              <h3 className="text-2xl font-semibold mb-4">Review Process</h3>
              <p>
                Our customer success team will carefully evaluate each refund application. We review all eligible
                requests to ensure they meet our refund criteria.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-6">Refund Method</h3>
              <p>
                Approved refunds will be processed through your <strong>original payment method</strong>. You will
                receive the refund to the same card or payment account used for the purchase.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-6">Timeframe</h3>
              <p>
                Refunds are typically completed within <strong>5-7 business days</strong> after approval. Depending on
                your payment provider, it may take an additional 3-5 business days for the funds to appear in your
                account.
              </p>
            </section>

            <section className="mt-12 not-prose">
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <AlertDescription className="text-foreground">
                  <strong>Payment Processor Protection:</strong> To protect customers from chargebacks, our payment
                  partner Creem may issue refunds within 60 days at their discretion, even if a merchant's policy states
                  otherwise. We strive to resolve all refund requests quickly to avoid escalations.
                </AlertDescription>
              </Alert>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-semibold mb-6">Important Notes</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>One-Time Credits:</strong> Refunds do not apply to one-time credit purchases. These are final
                  and non-refundable once purchased.
                </li>
                <li>
                  <strong>Annual Subscriptions:</strong> Pro-rated refunds may be considered for annual subscriptions on
                  a case-by-case basis within the first 30 days.
                </li>
                <li>
                  <strong>Policy Changes:</strong> This refund policy may be updated periodically. We recommend
                  reviewing the current policy before making a purchase.
                </li>
                <li>
                  <strong>Chargebacks:</strong> Initiating a chargeback before contacting our support team may result in
                  immediate account suspension and forfeiture of refund eligibility.
                </li>
              </ul>
            </section>

            <section className="mt-12 not-prose">
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about our refund policy or need assistance with your request, our support
                  team is here to help.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg">
                    <strong>Email:</strong>{" "}
                    <a href="mailto:support@videoforge.ai" className="text-primary hover:underline">
                      support@videoforge.ai
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Our team typically responds within 24 hours during business days.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12 p-6 bg-muted/30 rounded-lg not-prose">
              <h3 className="text-xl font-semibold mb-4">Related Policies</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <a href="/terms" className="block p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold mb-2">Terms of Service</h4>
                  <p className="text-sm text-muted-foreground">Platform usage terms</p>
                </a>
                <a href="/pricing" className="block p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold mb-2">Pricing Plans</h4>
                  <p className="text-sm text-muted-foreground">View subscription options</p>
                </a>
                <a href="/support" className="block p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold mb-2">Contact Support</h4>
                  <p className="text-sm text-muted-foreground">Get help from our team</p>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  )
}
