import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, HelpCircle, CreditCard, AlertCircle, FileText, MessageSquare } from "lucide-react"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const metadata = {
  title: "Contact & Support | SoraVideo AI",
  description: "Get help with your SoraVideo AI account, billing, and technical issues",
}

export default async function SupportPage({
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact & Support</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help! Get in touch with our support team for any questions, issues, or feedback.
            </p>
          </div>

          {/* Email Support Card */}
          <Card className="p-8 mb-12 bg-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-semibold mb-2">Email Support</h2>
                <p className="text-muted-foreground mb-4">Our primary support channel for all inquiries</p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Response Time:</strong> We typically respond within 24 hours during business days
                </p>
                <Button size="lg" asChild>
                  <a href="mailto:support@SoraVideo.ltd">support@SoraVideo.ltd</a>
                </Button>
              </div>
            </div>
          </Card>

          {/* How Can We Help Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How Can We Help?</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                <a href="mailto:support@SoraVideo.ltd?subject=General%20Question" className="block">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">General Questions</h3>
                      <p className="text-sm text-muted-foreground">Platform features, how-to guides, account help</p>
                    </div>
                  </div>
                </a>
              </Card>

              <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                <a href="mailto:support@SoraVideo.ltd?subject=Billing%20Issue" className="block">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Billing & Subscriptions</h3>
                      <p className="text-sm text-muted-foreground">Payments, refunds, plan changes, invoices</p>
                    </div>
                  </div>
                </a>
              </Card>

              <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                <a href="mailto:support@SoraVideo.ltd?subject=Technical%20Issue" className="block">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Technical Issues</h3>
                      <p className="text-sm text-muted-foreground">Bugs, errors, generation problems</p>
                    </div>
                  </div>
                </a>
              </Card>

              <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                <a href="mailto:support@SoraVideo.ltd?subject=Refund%20Request" className="block">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Refund Requests</h3>
                      <p className="text-sm text-muted-foreground">Process a refund within 72 hours of purchase</p>
                    </div>
                  </div>
                </a>
              </Card>
            </div>
          </div>

          {/* Manage Subscription Section */}
          <Card className="p-8 mb-12 bg-muted/30">
            <h2 className="text-2xl font-semibold mb-4">Manage Your Subscription</h2>
            <p className="text-muted-foreground mb-6">
              Access the Creem Customer Portal to update payment methods or cancel your subscription
            </p>

            <div className="bg-background p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">How to Access the Portal:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold mt-0.5">•</span>
                  <span>
                    <strong>Via Dashboard:</strong> Navigate to Account → Billing in your SoraVideo AI dashboard
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold mt-0.5">•</span>
                  <span>
                    <strong>Via Email Receipt:</strong> After each successful payment, you receive a receipt email
                    containing a magic link to the Creem Customer Portal
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              <strong>Cancel Anytime:</strong> You can manage or cancel your subscription directly through the Creem
              Customer Portal using the magic link in your receipt emails or by accessing it from your account
              dashboard. Self-service cancellation and billing updates are available 24/7.
            </p>
          </Card>

          {/* Before Contacting Support */}
          <Card className="p-8 mb-12">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">Before Contacting Support</h2>
                <p className="text-muted-foreground mb-4">
                  Please check our{" "}
                  <a href="/#faq" className="text-primary hover:underline">
                    FAQ section
                  </a>{" "}
                  for quick answers to common questions about credits, video generation, and subscriptions.
                </p>
                <p className="text-muted-foreground">
                  When contacting support, please include your account email and a detailed description of your issue to
                  help us assist you faster.
                </p>
              </div>
            </div>
          </Card>

          {/* Self-Help Resources */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Self-Help Resources</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <a href="/pricing" className="block">
                <Card className="p-6 h-full hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-2">Pricing & Plans</h3>
                  <p className="text-sm text-muted-foreground">View subscription options and features</p>
                </Card>
              </a>
              <a href="/refund" className="block">
                <Card className="p-6 h-full hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-2">Refund Policy</h3>
                  <p className="text-sm text-muted-foreground">Learn about our refund eligibility</p>
                </Card>
              </a>
              <a href="/#faq" className="block">
                <Card className="p-6 h-full hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-2">FAQ</h3>
                  <p className="text-sm text-muted-foreground">Common questions and answers</p>
                </Card>
              </a>
            </div>
          </div>

          {/* Legal & Policies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Legal & Policies</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              <a href="/refund" className="text-primary hover:underline">
                Refund Policy
              </a>
            </div>
          </div>

          {/* Support Hours */}
          <Card className="p-6 bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Support Hours:</strong> Our team is available Monday through Friday, 9 AM - 6 PM PST. We respond
              to all inquiries within 24 hours during business days. For urgent billing issues, please mark your email
              as "Urgent".
            </p>
          </Card>

          {/* Disclaimer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> SoraVideo AI is an independent platform providing custom interfaces for
              third-party AI models. We are not affiliated with any AI model providers. For support with our platform,
              contact us at support@SoraVideo.ltd
            </p>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  )
}
