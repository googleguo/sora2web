"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wand2, AlertCircle, CheckCircle } from "lucide-react"

interface RemixDialogProps {
  videoId?: string
  originalPrompt: string
  duration: number
  aspectRatio: string
  onSuccess?: () => void
}

export function RemixDialog({ videoId, originalPrompt, duration, aspectRatio, onSuccess }: RemixDialogProps) {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [selectedDuration, setSelectedDuration] = useState(duration.toString())
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(aspectRatio)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [status, setStatus] = useState("")

  const handleSubmit = async () => {
    if (!videoId) {
      setError("This video cannot be re-edited (missing video ID)")
      return
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt describing your changes")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess(false)
    setTaskId(null)
    setVideoUrl(null)
    setStatus("Creating remix task...")

    try {
      const response = await fetch("/api/remix-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          prompt,
          aspectRatio: selectedAspectRatio,
          duration: Number.parseInt(selectedDuration),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create remix task")
      }

      setTaskId(data.taskId)
      setStatus("Remixing video...")

      // Start polling for status
      const interval = setInterval(() => checkStatus(data.taskId), 5000)
      setPollInterval(interval)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remix video")
      setIsLoading(false)
    }
  }

  const checkStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/check-video-status?taskId=${id}`)
      const data = await response.json()

      if (data.status === "completed" && data.videoUrl) {
        if (pollInterval) {
          clearInterval(pollInterval)
          setPollInterval(null)
        }

        setVideoUrl(data.videoUrl)
        setSuccess(true)
        setIsLoading(false)
        setStatus("Video remixed successfully!")

        if (onSuccess) {
          onSuccess()
        }
      } else if (data.status === "failed") {
        if (pollInterval) {
          clearInterval(pollInterval)
          setPollInterval(null)
        }

        setError("Video remix failed")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error checking status:", err)
    }
  }

  const handleClose = () => {
    if (pollInterval) {
      clearInterval(pollInterval)
      setPollInterval(null)
    }
    setOpen(false)
    setPrompt("")
    setError("")
    setSuccess(false)
    setIsLoading(false)
    setTaskId(null)
    setVideoUrl(null)
    setStatus("")
  }

  if (!videoId) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <Wand2 className="h-3 w-3" />
          Re-edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Re-edit Video</DialogTitle>
          <DialogDescription>Remix your video with new creative changes</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Original Prompt</Label>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{originalPrompt}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remix-prompt">Remix Prompt *</Label>
            <Textarea
              id="remix-prompt"
              placeholder="e.g., 'Change from night to day', 'Add snow falling', 'Make it sunny'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Describe what changes you want to make to the video</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="remix-duration">Duration</Label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration} disabled={isLoading}>
                <SelectTrigger id="remix-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="25">25 seconds (Pro)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remix-aspect-ratio">Aspect Ratio</Label>
              <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio} disabled={isLoading}>
                <SelectTrigger id="remix-aspect-ratio">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          {success && videoUrl && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="text-green-500 font-medium">Video remixed successfully!</p>
                  <video src={videoUrl} controls className="w-full rounded-md" />
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading && !success}>
            {success ? "Close" : "Cancel"}
          </Button>
          {!success && (
            <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Remixing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Remix Video
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
