import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get video generation history from localStorage (client-side managed)
    // This endpoint returns empty as videos are stored in localStorage
    // But we can return credit usage related to videos
    const { data: videoCredits } = await supabase
      .from("credit_history")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "video_generation")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    return NextResponse.json({
      videos: videoCredits || [],
      total: videoCredits?.length || 0,
    })
  } catch (error) {
    console.error("Videos fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
