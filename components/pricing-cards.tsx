"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"

type BillingPeriod = "monthly" | "yearly" | "onetime"

interface Plan {
  name: string
  badge: string | null
  price: {
    monthly: number
    yearly: number
    onetime?: number
  }
  credits: string
  features: string[]
  popular?: boolean
  productId: {
    monthly: string
    yearly: string
    onetime?: string
  }
}

type PricingCardsProps = {
  dict: any
}

export function PricingCards({ dict }: PricingCardsProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly")
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const pricingPlans: Plan[] = [
    {
      name: dict.PricingPlans?.starter?.name || "Starter",
      badge: dict.PricingPlans?.starter?.badge || null,
      price: {
        monthly: 29,
        yearly: 290,
        onetime: 39,
      },
      credits: dict.PricingPlans?.starter?.credits || "249 credits/month | 10 videos",
      features: dict.PricingPlans?.starter?.features || [
        "AI style templates included",
        "Fastest generation speed",
        "Basic customer support",
        "HD video quality",
      ],
      productId: {
        monthly: "prod_starter_monthly",
        yearly: "prod_starter_yearly",
        onetime: "prod_starter_onetime",
      },
    },
    {
      name: dict.PricingPlans?.basic?.name || "Basic",
      badge: dict.PricingPlans?.basic?.badge || "Most economical",
      price: {
        monthly: 49,
        yearly: 490,
        onetime: 69,
      },
      credits: dict.PricingPlans?.basic?.credits || "749 credits/month | 30 videos",
      features: dict.PricingPlans?.basic?.features || [
        "All style templates included",
        "Priority generation queue",
        "Priority customer support",
        "4K video quality",
      ],
      productId: {
        monthly: "prod_basic_monthly",
        yearly: "prod_basic_yearly",
        onetime: "prod_basic_onetime",
      },
    },
    {
      name: dict.PricingPlans?.pro?.name || "Pro",
      badge: dict.PricingPlans?.pro?.badge || "Most Popular",
      price: {
        monthly: 99,
        yearly: 990,
        onetime: 129,
      },
      credits: dict.PricingPlans?.pro?.credits || "1499 credits/month | 60 videos",
      features: dict.PricingPlans?.pro?.features || [
        "All style templates included",
        "Fastest generation speed",
        "Priority customer support",
        "Commercial use license",
        "API access",
      ],
      popular: true,
      productId: {
        monthly: "prod_pro_monthly",
        yearly: "prod_pro_yearly",
        onetime: "prod_pro_onetime",
      },
    },
    {
      name: dict.PricingPlans?.max?.name || "Max",
      badge: dict.PricingPlans?.max?.badge || "Best value",
      price: {
        monthly: 199,
        yearly: 1990,
        onetime: 249,
      },
      credits: dict.PricingPlans?.max?.credits || "2249 credits/month | 90 videos",
      features: dict.PricingPlans?.max?.features || [
        "All style templates included",
        "Fastest generation speed",
        "Unlimited project storage",
        "Commercial use license",
        "API access",
        "Dedicated support",
      ],
      productId: {
        monthly: "prod_max_monthly",
        yearly: "prod_max_yearly",
        onetime: "prod_max_onetime",
      },
    },
  ]

  const handleCheckout = async (plan: Plan) => {
    setLoadingPlan(plan.name)

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: plan.productId[billingPeriod],
          planName: plan.name,
          billingPeriod: billingPeriod,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout")
      }

      const data = await response.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center gap-2 mb-12">
          <Button
            variant={billingPeriod === "monthly" ? "default" : "outline"}
            onClick={() => setBillingPeriod("monthly")}
            className="rounded-full px-8"
          >
            {dict.Pricing?.monthly || "Monthly"}
          </Button>
          <Button
            variant={billingPeriod === "yearly" ? "default" : "outline"}
            onClick={() => setBillingPeriod("yearly")}
            className="rounded-full px-8"
          >
            {dict.Pricing?.yearly || "Yearly"}
            <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">
              {dict.Pricing?.save || "Save 17%"}
            </span>
          </Button>
          <Button
            variant={billingPeriod === "onetime" ? "default" : "outline"}
            onClick={() => setBillingPeriod("onetime")}
            className="rounded-full px-8"
          >
            {dict.Pricing?.oneTime || "One-Time"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all ${
                plan.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.credits}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    ${billingPeriod === "onetime" ? plan.price.onetime : plan.price[billingPeriod]}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {billingPeriod === "onetime" ? "" : `/${billingPeriod === "monthly" ? "mo" : "yr"}`}
                  </span>
                </div>
                {billingPeriod === "yearly" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ${(plan.price.yearly / 12).toFixed(2)}/month billed annually
                  </p>
                )}
                {billingPeriod === "onetime" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dict.PricingPlans?.oneTimeNote || "One-time payment, credits never expire"}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan !== null}
                className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
                size="lg"
              >
                {loadingPlan === plan.name ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {dict.Pricing?.loading || "Loading..."}
                  </>
                ) : (
                  dict.Pricing?.getStarted || "Get Started"
                )}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-card/30 border border-border rounded-lg p-6">
            <h4 className="font-semibold mb-2 text-foreground">
              {dict.PricingPlans?.usageTitle || "Usage & Licensing"}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dict.PricingPlans?.usageNote ||
                "Credits from subscriptions expire 12 months from the date of purchase. All subscriptions maintain your existing credits and roll over unused credits to the next month. Commercial use is included in Pro and Max tiers."}
            </p>
            <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-4">
              <strong>{dict.PricingPlans?.importantLabel || "Important"}:</strong>{" "}
              {dict.PricingPlans?.disclaimerNote ||
                "SoraVideo AI is an independent platform and is not affiliated with, endorsed by, or sponsored by any AI model providers."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
