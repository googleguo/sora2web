import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's credits and subscription info
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits, subscription_tier, subscription_status, subscription_expires_at")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("[v0] Error fetching user data:", userError)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    return NextResponse.json({
      credits: userData.credits || 0,
      subscription: {
        tier: userData.subscription_tier,
        status: userData.subscription_status,
        expiresAt: userData.subscription_expires_at,
      },
    })
  } catch (error) {
    console.error("[v0] Error in credits API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
