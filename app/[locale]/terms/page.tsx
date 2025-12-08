import { getDictionary } from "@/lib/i18n/get-dictionary"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms of Service | VideoForge AI",
  description: "Platform usage terms and conditions for VideoForge AI",
}

export default async function TermsPage({
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
        <div className="max-w-4xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: December 4, 2025</p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using VideoForge AI ("the Platform"), you accept and agree to be bound by these Terms of
              Service ("Terms"). If you disagree with any part of these terms, you may not access the Platform.
              VideoForge AI is an independent platform and is not affiliated with any AI model providers.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Conduct Guidelines</h2>
            <p>When using VideoForge AI, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Infringe upon any copyright, trademark, or other intellectual property rights</li>
              <li>Create harmful, illegal, or offensive content</li>
              <li>Deceive others regarding your identity or the origin of content</li>
              <li>Upload malicious code, viruses, or any harmful software</li>
              <li>Attempt to circumvent security measures or usage limitations</li>
              <li>Share or resell your account access to third parties</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">3. Content Policy and Restrictions</h2>
            <p>The following content is strictly prohibited on VideoForge AI:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adult, sexual, or pornographic content</li>
              <li>Content involving minors in any inappropriate context</li>
              <li>Graphic violence or gore</li>
              <li>Unauthorized use of public figures or celebrities</li>
              <li>Content that violates local, state, national, or international laws</li>
              <li>Misleading deepfakes without proper disclosure</li>
              <li>Content promoting hate speech, discrimination, or harassment</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">4. AI-Generated Content</h2>
            <p>You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are solely responsible for all materials you upload and prompts you provide</li>
              <li>AI-generated results may vary and are not guaranteed to be perfect or error-free</li>
              <li>The Platform may use anonymized data to improve services</li>
              <li>You must disclose AI-generated content when shared publicly, especially for deepfakes</li>
              <li>
                Generated content quality depends on various factors including prompt quality and source materials
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">5. Ownership and Intellectual Property</h2>
            <p>VideoForge AI respects intellectual property rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain ownership of your original uploaded content</li>
              <li>Premium subscription users receive commercial usage rights for generated content</li>
              <li>Free tier users are limited to personal, non-commercial use</li>
              <li>VideoForge AI retains all rights to the Platform, technology, and infrastructure</li>
              <li>You grant us a limited license to process your content for service delivery</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">6. Platform Usage Limitations</h2>
            <p>Platform usage is subject to certain limitations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Credit limits and quotas based on subscription tier</li>
              <li>File size and format restrictions (see documentation for details)</li>
              <li>Processing time and concurrent generation limits</li>
              <li>Platform availability is not guaranteed 100% of the time</li>
              <li>Account sharing is strictly prohibited</li>
              <li>Rate limits may apply to prevent abuse</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Privacy Practices</h2>
            <p>Your privacy matters to us. We:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Collect only necessary usage metrics and account information</li>
              <li>Process content securely with enterprise-grade encryption</li>
              <li>Never sell your personal information to third parties</li>
              <li>Comply with applicable data protection regulations</li>
            </ul>
            <p className="mt-4">
              For detailed privacy practices, please review our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">8. Subscription and Billing</h2>
            <p>Subscription terms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Pricing is subject to change with 30 days advance notice</li>
              <li>
                Refund requests are evaluated individually - see our{" "}
                <a href="/refund" className="text-primary hover:underline">
                  Refund Policy
                </a>
              </li>
              <li>You can manage your subscription through your account billing portal</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>Unused credits do not roll over and expire at period end</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">9. Account Termination</h2>
            <p>We reserve the right to suspend or terminate accounts for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abuse of Platform resources or features</li>
              <li>Non-payment of subscription fees</li>
              <li>Creating content that violates our content policy</li>
            </ul>
            <p className="mt-4">
              Upon termination, you have a 30-day window to download your content before permanent deletion. We are not
              liable for any loss of content after this period.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">10. Liability Limitations</h2>
            <p>VideoForge AI is provided "as is" without warranties:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We make no guarantees regarding content accuracy, quality, or suitability</li>
              <li>We are not liable for any damages resulting from Platform use</li>
              <li>Our total liability is limited to the amount you paid in the last 12 months</li>
              <li>You assume all risks associated with using AI-generated content</li>
              <li>We are not responsible for third-party service interruptions</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless VideoForge AI, its officers, directors, employees, and agents
              from any claims, damages, losses, liabilities, and expenses arising from your use of the Platform or
              violation of these Terms.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">12. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or your use of the Platform will be resolved through binding
              arbitration in accordance with applicable laws. You waive your right to participate in class action
              lawsuits.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">13. Terms Modifications</h2>
            <p>
              We may update these Terms periodically. Continued use of the Platform after changes constitutes acceptance
              of the updated Terms. We will notify users of significant changes via email or Platform notifications at
              least 30 days in advance.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at:</p>
            <p className="mt-4">
              <strong>Email:</strong> <a href="mailto:support@videoforge.ai">support@videoforge.ai</a>
            </p>
          </section>

          <section className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Related Policies</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <a href="/privacy" className="block p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-2">Privacy Policy</h4>
                <p className="text-sm text-muted-foreground">How we collect and use your data</p>
              </a>
              <a href="/refund" className="block p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-2">Refund Policy</h4>
                <p className="text-sm text-muted-foreground">Our refund terms and eligibility</p>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  )
}
