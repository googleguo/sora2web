import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId, prompt, aspectRatio, duration } = body

    console.log("[v0] Remix video request:", { videoId, prompt, aspectRatio, duration })

    if (!videoId || !prompt) {
      return NextResponse.json({ error: "Missing required fields: videoId and prompt" }, { status: 400 })
    }

    const apiKey = process.env.SORA_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "SORA_API_KEY not configured" }, { status: 500 })
    }

    // Determine model based on duration
    const model = duration === 25 ? "sora-2-pro" : "sora-2"

    const apiUrl = `https://duomiapi.com/v1/videos/${videoId}/remix`

    console.log("[v0] Calling API:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        aspect_ratio: aspectRatio,
        duration,
      }),
    })

    console.log("[v0] API response status:", response.status)

    const data = await response.json()
    console.log("[v0] API response data:", data)

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Failed to remix video" }, { status: response.status })
    }

    // Return the new task ID
    const taskId = data.id || data.task_id || data.taskId
    if (!taskId) {
      console.error("[v0] No task ID found in response:", data)
      return NextResponse.json({ error: "No task ID returned from API" }, { status: 500 })
    }

    console.log("[v0] Remix task created successfully:", taskId)

    return NextResponse.json({ taskId })
  } catch (error) {
    console.error("[v0] Error in remix-video route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
