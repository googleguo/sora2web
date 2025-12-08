export interface VideoRecord {
  id: string
  type: "text-to-video" | "image-to-video"
  prompt: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number
  aspectRatio: string
  model: string
  createdAt: string
  imageUrl?: string
  videoId?: string
}

export function saveVideoRecord(record: Omit<VideoRecord, "id" | "createdAt">): VideoRecord {
  const newRecord: VideoRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  const history = getVideoHistory()
  history.unshift(newRecord)

  // Keep only the last 50 records
  const limitedHistory = history.slice(0, 50)

  if (typeof window !== "undefined") {
    localStorage.setItem("videoforge-history", JSON.stringify(limitedHistory))
  }

  return newRecord
}

export function getVideoHistory(): VideoRecord[] {
  if (typeof window === "undefined") {
    return []
  }

  const stored = localStorage.getItem("videoforge-history")
  if (!stored) {
    return []
  }

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function deleteVideoRecord(id: string): void {
  const history = getVideoHistory()
  const filtered = history.filter((record) => record.id !== id)

  if (typeof window !== "undefined") {
    localStorage.setItem("videoforge-history", JSON.stringify(filtered))
  }
}

export function clearVideoHistory(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("videoforge-history")
  }
}
