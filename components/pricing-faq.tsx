"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type PricingFAQProps = {
  dict: any
}

export function PricingFAQ({ dict }: PricingFAQProps) {
  const faqs = dict.PricingFAQ?.items
      || [
    {
      question: "What are credits and how do they function?",
      answer:
        "Credits are the currency used within VideoForge AI to generate videos. Each video generation consumes a certain number of credits based on the duration and quality settings. Credits are included in your subscription plan and refresh monthly.",
    },
    {
      question: "Is it possible to change my subscription tier?",
      answer:
        "Yes, you can upgrade or downgrade your subscription tier at any time. Changes will take effect at the start of your next billing cycle. Any unused credits will roll over to your new plan.",
    },
    {
      question: "Will my unused credits roll over to next month?",
      answer:
        "Yes, all unused credits automatically roll over to the next month. Credits expire 12 months from the date of purchase, giving you plenty of time to use them.",
    },
    {
      question: "What distinguishes each pricing level?",
      answer:
        "Each tier offers different credit amounts and features. Higher tiers include more credits per month, priority generation queue, faster processing speeds, and additional features like commercial licensing and unlimited project storage.",
    },
    {
      question: "Which subscription should I select?",
      answer:
        "Choose based on your video generation needs. Starter is great for occasional use, Basic for regular creators, Pro for professionals needing commercial rights, and Max for high-volume production. You can always upgrade as your needs grow.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 7-day money-back guarantee for first-time subscribers. If you're not satisfied with VideoForge AI within the first 7 days, contact our support team for a full refund.",
    },
    {
      question: "What's the cancellation process?",
      answer:
        "You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you'll retain any unused credits for 12 months.",
    },
    {
      question: "Are enterprise packages available?",
      answer:
        "Yes, we offer custom enterprise packages for teams and organizations with high-volume needs. Contact our sales team at enterprise@videoforge.ai for a tailored solution with dedicated support and custom pricing.",
    },
    {
      question: "What if my credits run out mid-cycle?",
      answer:
        "If you run out of credits before your monthly refresh, you can purchase additional credit packs or upgrade to a higher tier. Upgrades take effect immediately and provide instant access to more credits.",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {dict.PricingFAQ?.title || "Frequently Asked Questions"}
        </h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card/30 border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
