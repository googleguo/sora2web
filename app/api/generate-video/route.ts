import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getCreditCostForDuration } from "@/lib/credits"

const API_BASE_URL = "https://duomiapi.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, aspect_ratio, duration, image_urls, model = "sora-2" } = body

    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("authError: ", authError)
      console.log("user: ", user)
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user's current credits
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("[v0] Error fetching user credits:", userError)
      return NextResponse.json({ error: "Failed to fetch user credits" }, { status: 500 })
    }

    // Calculate credit cost based on duration
    const creditCost = getCreditCostForDuration(duration)
    const currentCredits = userData?.credits || 0

    if (currentCredits < creditCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${creditCost} credits but only have ${currentCredits}.`,
          requiredCredits: creditCost,
          currentCredits,
        },
        { status: 402 },
      )
    }


    // </CHANGE>

    // Get API key from environment variable
    const apiKey = process.env.SORA_API_KEY

    if (!apiKey) {
      await supabaseAdmin.from("users").update({ credits: currentCredits }).eq("id", user.id)
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("[v0] Creating video generation task with params:", {
      model,
      prompt: prompt.substring(0, 50) + "...",
      aspect_ratio,
      duration,
      hasImages: !!image_urls,
    })

    // Create video generation task
    const response = await fetch(`${API_BASE_URL}/v1/videos/generations`, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        aspect_ratio,
        duration,
        ...(image_urls && image_urls.length > 0 && { image_urls }),
      }),
    })

    const data = await response.json()

    console.log("[v0] API response status:", response.status)
    console.log("[v0] API response data:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      // await supabaseAdmin.from("users").update({ credits: currentCredits }).eq("id", user.id)
      //
      // await supabaseAdmin.from("credit_history").insert({
      //   user_id: user.id,
      //   amount: creditCost,
      //   type: "refund",
      //   description: `Refund for failed video generation (${duration}s)`,
      // })

      return NextResponse.json(
        { error: data.message || data.error?.message || "Failed to create video generation task" },
        { status: response.status },
      )
    }

    const taskId = data.id || data.task_id || data.taskId

    if (!taskId) {
      console.error("[v0] No task ID found in response:", data)
      // await supabaseAdmin.from("users").update({ credits: currentCredits }).eq("id", user.id)
      //
      // await supabaseAdmin.from("credit_history").insert({
      //   user_id: user.id,
      //   amount: creditCost,
      //   type: "refund",
      //   description: `Refund for invalid API response (${duration}s)`,
      // })

      return NextResponse.json({ error: "Invalid API response: no task ID returned" }, { status: 500 })
    }

    console.log("[v0] Successfully created task with ID:", taskId)

    // Deduct credits
    const { error: deductError } = await supabaseAdmin
        .from("users")
        .update({ credits: currentCredits - creditCost })
        .eq("id", user.id)

    if (deductError) {
      console.error("[v0] Error deducting credits:", deductError)
      return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 })
    }

    // Record credit usage in history
    const { error: historyError } = await supabaseAdmin.from("credit_history").insert({
      user_id: user.id,
      amount: -creditCost,
      balance_after: currentCredits - creditCost,
      type: "usage",
      description: `Video generation (${duration}s)`,
      metadata: {
        duration,
        model,
        prompt: prompt.substring(0, 100),
      },
      task_id: taskId,
    })

    if (historyError) {
      console.error("Error credit_history:", historyError)
      return NextResponse.json({ error: "Failed to credit history" }, { status: 500 })
    }

    console.log(`[v0] Deducted ${creditCost} credits from user ${user.id}. Remaining: ${currentCredits - creditCost}`)


    return NextResponse.json({
      taskId,
      creditsDeducted: creditCost,
      remainingCredits: currentCredits - creditCost,
      currentCredits:currentCredits,
    })
  } catch (error) {
    console.error("[v0] Error creating video generation task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
