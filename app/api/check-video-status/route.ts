import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://duomiapi.com"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      console.error("[v0] Check status called without taskId")
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    console.log("[v0] Checking status for task:", taskId)

    // Get API key from environment variable
    const apiKey = process.env.SORA_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Query task status
    const response = await fetch(`${API_BASE_URL}/v1/videos/tasks/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    })

    const data = await response.json()

    console.log("[v0] Status check response:", {
      status: response.status,
      state: data.state,
      taskId: data.id,
    })

    if (!response.ok) {
      console.error("[v0] Status check failed:", data)
      return NextResponse.json(
        { error: data.error?.message || data.message || "Failed to check video status" },
        { status: response.status },
      )
    }

    const videoId = data.data?.videos?.[0]?.id || data.data?.video_id || data.video_id

    return NextResponse.json({
      id: data.id,
      state: data.state,
      videoUrl: data.state === "succeeded" ? data.data?.videos?.[0]?.url : null,
      videoId: data.state === "succeeded" ? videoId : null,
      message: data.message,
      createTime: data.create_time,
      updateTime: data.update_time,
    })
  } catch (error) {
    console.error("[v0] Error checking video status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
