import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const supabase = await createClient()

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("video-images").upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error("[v0] Supabase storage upload error:", error)
      return NextResponse.json({ error: `Failed to upload image: ${error.message}` }, { status: 500 })
    }

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("video-images").getPublicUrl(filePath)

    console.log("[v0] Image uploaded successfully:", publicUrl)

    return NextResponse.json({ imageUrl: publicUrl })
  } catch (error) {
    console.error("[v0] Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
