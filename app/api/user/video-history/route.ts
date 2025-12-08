import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const { data: videos, error } = await supabase
      .from("video_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching video history:", error)
      return NextResponse.json({ videos: [], total: 0 })
    }

    return NextResponse.json({
      videos: videos || [],
      total: videos?.length || 0,
    })
  } catch (error) {
    console.error("Video history fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch video history" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, prompt, videoUrl, duration, aspectRatio, model, imageUrl, videoId } = body

    if (!type || !prompt || !videoUrl || !duration || !aspectRatio || !model) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: video, error } = await supabase
      .from("video_history")
      .insert({
        user_id: user.id,
        type,
        prompt,
        video_url: videoUrl,
        duration,
        aspect_ratio: aspectRatio,
        model,
        image_url: imageUrl || null,
        video_id: videoId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving video history:", error)
      return NextResponse.json({ error: "Failed to save video" }, { status: 500 })
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error("Video history save error:", error)
    return NextResponse.json({ error: "Failed to save video history" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("id")

    if (!videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("video_history").delete().eq("id", videoId).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting video:", error)
      return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Video delete error:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}
