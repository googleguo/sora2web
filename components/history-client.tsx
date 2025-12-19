"use client"

import { useEffect, useState } from "react"
import { type VideoRecord, getVideoHistory, deleteVideoRecord, clearVideoHistory } from "@/lib/video-history"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Trash2, Clock, Film } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RemixDialog } from "@/components/remix-dialog"

export function HistoryClient() {
  const [history, setHistory] = useState<VideoRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setHistory(getVideoHistory())
    setIsLoading(false)
  }

  const handleDelete = (id: string) => {
    deleteVideoRecord(id)
    loadHistory()
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearVideoHistory()
      loadHistory()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <Film className="h-4 w-4" />
        <AlertDescription>No video generation history yet. Start creating videos to see them here!</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <Button variant="destructive" onClick={handleClearAll} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {history.map((record) => (
          <Card key={record.id} className="overflow-hidden group">
            <div className="aspect-video bg-muted relative">
              <video
                src={record.videoUrl}
                poster={record.thumbnailUrl}
                controls
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{record.prompt}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {record.duration}s
                    </span>
                    <span>{record.aspectRatio}</span>
                    {record.model.includes("pro") && <span className="text-primary font-medium">Pro</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-muted">
                  {record.type === "text-to-video" ? "Text to Video" : "Image to Video"}
                </span>
                <span>{formatDate(record.createdAt)}</span>
              </div>

              <div className="flex gap-2">
                <RemixDialog
                  videoId={record.id}
                  originalPrompt={record.prompt}
                  duration={record.duration}
                  aspectRatio={record.aspectRatio}
                  onSuccess={loadHistory}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => {
                    const a = document.createElement("a")
                    a.href = record.videoUrl
                    a.download = `SoraVideo-${record.id}.mp4`
                    a.click()
                  }}
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(record.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
