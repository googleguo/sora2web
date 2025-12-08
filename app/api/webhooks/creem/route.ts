import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { verifyCreemSignature } from "@/lib/webhook-signature"
import { sendPurchaseConfirmation, sendSubscriptionConfirmation, sendCancellationEmail } from "@/lib/email"

// Credit amounts for each plan
const PLAN_CREDITS: Record<string, number> = {
  starter: 249,
  basic: 749,
  pro: 1499,
  max: 2249,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("x-creem-signature")

    // Verify webhook signature
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const isValid = verifyCreemSignature(body, signature, webhookSecret)
      if (!isValid) {
        console.error("[v0] Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const event = JSON.parse(body)

    console.log("[v0] Creem webhook received:", event.type)

    // Handle different webhook events
    switch (event.type) {
      case "checkout.completed":
        await handleCheckoutCompleted(event.data)
        break

      case "subscription.created":
        await handleSubscriptionCreated(event.data)
        break

      case "subscription.updated":
        await handleSubscriptionUpdated(event.data)
        break

      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.data)
        break

      case "transaction.paid":
        await handleTransactionPaid(event.data)
        break

      default:
        console.log("[v0] Unhandled webhook type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}

async function handleCheckoutCompleted(data: any) {
  console.log("[v0] Processing checkout completed:", data.id)

  const customerEmail = data.customer?.email || data.email
  const productId = data.product?.id || data.productId
  const amount = data.order?.amount || data.amount || 0
  const metadata = data.metadata || {}

  // Parse plan info from product ID or metadata
  const planName = metadata.planName || "starter"
  const billingPeriod = metadata.billingPeriod || "monthly"
  const isOneTime = billingPeriod === "onetime"

  // Get credits for this plan
  const credits = PLAN_CREDITS[planName.toLowerCase()] || 249

  try {
    // Find user by email
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, credits")
      .eq("email", customerEmail)
      .single()

    if (userError) {
      console.error("[v0] User not found:", customerEmail)
      return
    }

    // Add credits to user account
    const { error: creditsError } = await supabaseAdmin.rpc("add_credits", {
      p_user_id: userData.id,
      p_amount: credits,
      p_type: isOneTime ? "purchase" : "subscription",
      p_description: `${planName} ${billingPeriod} purchase`,
      p_transaction_id: data.id,
    })

    if (creditsError) {
      console.error("[v0] Failed to add credits:", creditsError)
      return
    }

    // Create transaction record
    await supabaseAdmin.from("transactions").insert({
      id: data.id,
      user_id: userData.id,
      type: isOneTime ? "one_time" : "subscription",
      amount: amount / 100, // Convert cents to dollars
      currency: data.currency || "USD",
      credits_added: credits,
      product_id: productId,
      product_name: `${planName} ${billingPeriod}`,
      status: "completed",
      creem_transaction_id: data.transactionId,
      creem_session_id: data.id,
      metadata: metadata,
    })

    // Send confirmation email
    await sendPurchaseConfirmation(customerEmail, planName, credits, amount / 100)

    console.log("[v0] Checkout completed successfully for:", customerEmail)
  } catch (error) {
    console.error("[v0] Error processing checkout:", error)
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log("[v0] Processing subscription created:", data.id)

  const customerId = data.customer?.id || data.customerId
  const customerEmail = data.customer?.email
  const status = data.status
  const metadata = data.metadata || {}

  const planName = metadata.planName || "starter"
  const billingPeriod = metadata.billingPeriod || "monthly"
  const credits = PLAN_CREDITS[planName.toLowerCase()] || 249

  try {
    // Find user by email
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("email", customerEmail)
      .single()

    if (userError) {
      console.error("[v0] User not found:", customerEmail)
      return
    }

    // Update user with subscription info
    await supabaseAdmin
      .from("users")
      .update({
        subscription_id: data.id,
        subscription_status: status,
        subscription_tier: planName.toLowerCase(),
        subscription_period: billingPeriod,
        subscription_expires_at: data.currentPeriodEnd || data.current_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.id)

    // Create subscription record
    await supabaseAdmin.from("subscriptions").insert({
      id: data.id,
      user_id: userData.id,
      tier: planName.toLowerCase(),
      period: billingPeriod,
      status: status,
      credits_per_month: credits,
      current_period_start: data.currentPeriodStart || data.current_period_start,
      current_period_end: data.currentPeriodEnd || data.current_period_end,
      creem_subscription_id: data.id,
      metadata: metadata,
    })

    // Grant initial credits
    await supabaseAdmin.rpc("add_credits", {
      p_user_id: userData.id,
      p_amount: credits,
      p_type: "subscription",
      p_description: `${planName} ${billingPeriod} subscription activated`,
    })

    // Send confirmation email
    await sendSubscriptionConfirmation(customerEmail, planName, billingPeriod)

    console.log("[v0] Subscription created successfully for:", customerEmail)
  } catch (error) {
    console.error("[v0] Error processing subscription creation:", error)
  }
}

async function handleSubscriptionUpdated(data: any) {
  console.log("[v0] Processing subscription updated:", data.id)

  const subscriptionId = data.id
  const status = data.status

  try {
    // Update subscription status in database
    await supabaseAdmin
      .from("subscriptions")
      .update({
        status: status,
        current_period_start: data.currentPeriodStart || data.current_period_start,
        current_period_end: data.currentPeriodEnd || data.current_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)

    // Update user's subscription status
    await supabaseAdmin
      .from("users")
      .update({
        subscription_status: status,
        subscription_expires_at: data.currentPeriodEnd || data.current_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq("subscription_id", subscriptionId)

    // If subscription renewed, add credits
    if (status === "active" && data.renewed) {
      const { data: subData } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id, credits_per_month, tier")
        .eq("id", subscriptionId)
        .single()

      if (subData) {
        await supabaseAdmin.rpc("add_credits", {
          p_user_id: subData.user_id,
          p_amount: subData.credits_per_month,
          p_type: "subscription",
          p_description: `${subData.tier} subscription renewed`,
        })
      }
    }

    console.log("[v0] Subscription updated successfully:", subscriptionId)
  } catch (error) {
    console.error("[v0] Error updating subscription:", error)
  }
}

async function handleSubscriptionCancelled(data: any) {
  console.log("[v0] Processing subscription cancelled:", data.id)

  const subscriptionId = data.id
  const customerId = data.customer?.id || data.customerId

  try {
    // Update subscription status
    await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)

    // Update user's subscription status
    const { data: userData } = await supabaseAdmin
      .from("users")
      .update({
        subscription_status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("subscription_id", subscriptionId)
      .select("email, subscription_expires_at")
      .single()

    if (userData) {
      // Send cancellation email
      const expiresAt = new Date(userData.subscription_expires_at).toLocaleDateString()
      await sendCancellationEmail(userData.email, "subscription", expiresAt)
    }

    console.log("[v0] Subscription cancelled successfully:", subscriptionId)
  } catch (error) {
    console.error("[v0] Error processing cancellation:", error)
  }
}

async function handleTransactionPaid(data: any) {
  console.log("[v0] Processing transaction paid:", data.id)

  const transactionId = data.id
  const amount = data.amount
  const currency = data.currency || "USD"

  try {
    // Update transaction record if exists
    await supabaseAdmin
      .from("transactions")
      .update({
        status: "completed",
        creem_transaction_id: transactionId,
        updated_at: new Date().toISOString(),
      })
      .eq("creem_session_id", data.sessionId)

    console.log("[v0] Transaction updated successfully:", transactionId)
  } catch (error) {
    console.error("[v0] Error processing transaction:", error)
  }
}
