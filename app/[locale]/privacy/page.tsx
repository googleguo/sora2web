import { getDictionary } from "@/lib/i18n/get-dictionary"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Privacy Policy | VideoForge AI",
  description: "How VideoForge AI protects your privacy and handles your data",
}

export default async function PrivacyPage({
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: December 4, 2025</p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Welcome to VideoForge AI's Privacy Policy. This document explains how we collect, use, and protect your
              personal information when you use our AI video generation platform at videoforge.ai. VideoForge AI is an
              independent platform and is not affiliated with any AI model providers.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information Collection</h2>
            <p>We collect two categories of information:</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account details (email, name, password)</li>
              <li>Billing and payment information</li>
              <li>User-generated content (prompts, images, videos)</li>
              <li>Communication preferences and support inquiries</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Data:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Platform engagement metrics and usage patterns</li>
              <li>Device and system information (IP address, browser type, OS)</li>
              <li>Performance and error logs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Deliver AI-powered video generation technology and fulfill creative requests</li>
              <li>Administer user accounts and process transactions</li>
              <li>Maintain platform security and prevent fraud</li>
              <li>Improve our services through analytics and performance monitoring</li>
              <li>Communicate service updates, respond to inquiries, and provide customer support</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p>We implement comprehensive security safeguards:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Advanced encryption for data in transit and at rest</li>
              <li>Ongoing security assessments and vulnerability testing</li>
              <li>Enterprise-grade secure storage infrastructure</li>
              <li>Multi-factor authentication options for account protection</li>
              <li>Regular security training and access controls</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential Service Providers:</strong> Payment processors, cloud hosting, and infrastructure
                partners necessary to deliver our services
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law, court order, or to protect our rights and
                safety
              </li>
              <li>
                <strong>Strategic Partners:</strong> Only with your explicit consent for specific integrations or
                features
              </li>
            </ul>
            <p className="mt-4">
              <strong>We strictly prohibit selling your personal information to third parties.</strong>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Privacy Rights</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of personal data we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal data (subject to legal retention
                requirements)
              </li>
              <li>
                <strong>Portability:</strong> Download your personal information in a machine-readable format
              </li>
              <li>
                <strong>Opt-out:</strong> Manage communication preferences and marketing emails
              </li>
              <li>
                <strong>Object:</strong> Object to certain processing activities
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:support@videoforge.ai">support@videoforge.ai</a>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">6. Content Retention Policy</h2>
            <p>Content storage varies by subscription tier:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Uploaded Content:</strong> Temporarily stored for processing, then deleted unless saved by user
              </li>
              <li>
                <strong>Generated Videos:</strong> Stored based on subscription tier and user preferences
              </li>
              <li>
                <strong>Free Account Content:</strong> May be removed after 30 days of inactivity
              </li>
              <li>
                <strong>Premium Account Content:</strong> Retained according to subscription level
              </li>
              <li>
                <strong>Account Deletion:</strong> All content permanently deleted within 30 days of account closure
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Collection Transparency</h2>
            <p>We believe in complete transparency:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We clearly disclose all data collection practices</li>
              <li>You can opt-out of non-essential data collection</li>
              <li>We provide granular controls for marketing communications</li>
              <li>Cookies can be managed through browser settings</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">8. Special Protections</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Minors:</h3>
            <p>
              VideoForge AI does not knowingly collect data from users under 13 years of age. If we discover such
              collection, we will promptly delete the information.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">International Data Transfers:</h3>
            <p>
              If you access VideoForge AI from outside our primary jurisdiction, your data may be transferred
              internationally. We implement appropriate safeguards for cross-border data processing.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">California Residents:</h3>
            <p>
              California users have additional rights under CCPA. Contact us to learn more about your specific rights.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our services, provide services on our
              behalf, or assist us in analyzing how our services are used. These third parties have access to your
              personal information only to perform specific tasks on our behalf and are obligated not to disclose or use
              it for any other purpose.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">10. Policy Updates</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
              Significant changes will be communicated via email or prominent platform notifications. Your continued use
              after updates constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact for Privacy Concerns</h2>
            <p>For privacy-related questions, requests, or concerns, please contact:</p>
            <p className="mt-4">
              <strong>Email:</strong> <a href="mailto:support@videoforge.ai">support@videoforge.ai</a>
            </p>
            <p>We aim to respond to all privacy inquiries within 30 days.</p>
          </section>

          <section className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Related Policies</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <a href="/terms" className="block p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-2">Terms of Service</h4>
                <p className="text-sm text-muted-foreground">Platform usage terms and conditions</p>
              </a>
              <a href="/refund" className="block p-4 bg-background rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold mb-2">Refund Policy</h4>
                <p className="text-sm text-muted-foreground">Our refund terms and eligibility</p>
              </a>
            </div>
          </section>
        </div>
      </main>
      {/* Add dict prop to Footer */}
      <Footer dict={dict} />
    </div>
  )
}
