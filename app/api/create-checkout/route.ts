import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, planName, customerEmail } = body

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const apiKey = process.env.CREEM_API_KEY
    if (!apiKey) {
      console.error("[v0] CREEM_API_KEY is not set")
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Create checkout session with Creem API
    const response = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        product_id: productId,
        customer: customerEmail ? { email: customerEmail } : undefined,
        success_url: `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          plan: planName,
          source: "pricing_page",
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] Creem API error:", errorData)
      return NextResponse.json(
        { error: "Failed to create checkout session", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      sessionId: data.id,
    })
  } catch (error) {
    console.error("[v0] Error creating checkout:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
