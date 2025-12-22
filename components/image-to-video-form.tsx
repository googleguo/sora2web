"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Download, Upload, X, AlertCircle, Play } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginDialog } from "@/components/login-dialog"

export function ImageToVideoForm() {
  const [prompt, setPrompt] = useState("")
  const [duration, setDuration] = useState("10")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkAuthAndFetchCredits()
  }, [])

  const checkAuthAndFetchCredits = async () => {
    try {
      const response = await fetch("/api/user/credits")
      if (response.ok) {
        const data = await response.json()
        setUserCredits(data.credits)
        setIsAuthenticated(true)
      } else if (response.status === 401) {
        setIsAuthenticated(false)
        setUserCredits(null)
      }
    } catch (err) {
      console.error("[v0] Error fetching user credits:", err)
      setIsAuthenticated(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      setUploadedImageUrl(data.imageUrl)
    } catch (err) {
      console.error("[v0] Error uploading image:", err)
      setError(err instanceof Error ? err.message : "Failed to upload image")
      setUploadedImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setUploadedImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleGenerate = async () => {
    if (!uploadedImageUrl || !prompt.trim()) return

    if (!isAuthenticated) {
      setShowLoginDialog(true)
      return
    }

    setIsGenerating(true)
    setGeneratedVideo(null)
    setError(null)
    setStatusMessage("Creating video generation task...")

    try {
      console.log("[v0] Starting image-to-video generation request")

      const selectedDuration = Number.parseInt(duration)
      const model = selectedDuration === 25 ? "sora-2-pro" : "sora-2"

      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          aspect_ratio: aspectRatio,
          duration: selectedDuration,
          image_urls: [uploadedImageUrl],
          model,
        }),
      })

      const data = await response.json()
      console.log("[v0] Generate video response:", data)

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error(
            `Insufficient credits. This video requires ${data.requiredCredits} credits, but you only have ${data.currentCredits}.`,
          )
        }
        throw new Error(data.error || "Failed to create video generation task")
      }

      if (!data.taskId) {
        throw new Error("No task ID received from server")
      }

      const taskId = data.taskId
      console.log("[v0] Received task ID:", taskId)
      if (data.remainingCredits !== undefined) {
        setUserCredits(data.remainingCredits)
      }
      setStatusMessage("Video generation in progress...")

      let pollInterval: NodeJS.Timeout | null = null

      pollInterval = setInterval(async () => {
        try {
          console.log("[v0] Polling status for task:", taskId)
          const statusResponse = await fetch(`/api/check-video-status?taskId=${taskId}`)
          const statusData = await statusResponse.json()

          console.log("[v0] Video generation status:", statusData.state)

          if (statusData.state === "succeeded") {
            if (pollInterval) clearInterval(pollInterval)
            setGeneratedVideo(statusData.videoUrl)
            setIsGenerating(false)
            setStatusMessage("")

            try {
              // await fetch("/api/user/video-history", {
              //   method: "POST",
              //   headers: { "Content-Type": "application/json" },
              //   body: JSON.stringify({
              //     type: "image-to-video",
              //     prompt,
              //     videoUrl: statusData.videoUrl,
              //     duration: selectedDuration,
              //     aspectRatio,
              //     model,
              //     imageUrl: uploadedImageUrl || undefined,
              //     videoId: statusData.videoId || undefined,
              //   }),
              // })
              await fetch("/api/user/video-history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "image-to-video",
                  prompt,
                  videoUrl: statusData.videoUrl||undefined,
                  duration: selectedDuration,
                  aspectRatio,
                  model,
                  imageUrl: uploadedImageUrl || undefined,
                  videoId: statusData.videoId || statusData.id ||undefined,
                  taskId: taskId || undefined,
                  status:1,
                }),
              })
            } catch (saveErr) {
              console.error("[v0] Error saving video to history:", saveErr)
            }
          } else if (statusData.state === "error") {
            if (pollInterval) clearInterval(pollInterval)
            await fetch("/api/return-credits", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                currentCredits: data.currentCredits,
                creditsDeducted: data.creditsDeducted,
              }),
            })
            await fetch("/api/user/video-history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "image-to-video",
                prompt,
                videoUrl: statusData.videoUrl||undefined,
                duration: selectedDuration,
                aspectRatio,
                model,
                imageUrl: uploadedImageUrl || undefined,
                videoId: statusData.videoId || statusData.id ||undefined,
                taskId: taskId || undefined,
                status:2,
              }),
            })
            throw new Error(statusData.message || "Video generation failed")
          } else {
            setStatusMessage(`Video generation in progress... (${statusData.state})`)
          }
        } catch (err) {
          if (pollInterval) clearInterval(pollInterval)
          throw err
        }
      }, 5000)

      setTimeout(() => {
        if (pollInterval) clearInterval(pollInterval)
        if (isGenerating) {
          setError("Video generation timed out. Please try again.")
          setIsGenerating(false)
        }
      }, 300000)
    } catch (err) {
      console.error("[v0] Error generating video:", err)
      setError(err instanceof Error ? err.message : "Failed to generate video")
      setIsGenerating(false)
      setStatusMessage("")
      checkAuthAndFetchCredits()
    }
  }

  const getCreditCost = () => {
    const durationNum = Number.parseInt(duration)
    if (durationNum === 25) return 50
    return 10
  }

  return (
    <>
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={(open) => {
          setShowLoginDialog(open)
          if (!open) {
            checkAuthAndFetchCredits()
          }
        }}
        redirectTo="/generate"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Form */}
        <div className="space-y-4 sm:space-y-6">
          {isAuthenticated ? (
            userCredits !== null && (
              <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">Available Credits:</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">{userCredits}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Cost: <span className="font-semibold text-foreground">{getCreditCost()}</span> credits
                  </div>
                </div>
              </Card>
            )
          ) : (
            <Card className="p-3 sm:p-4 bg-amber-500/10 border-amber-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                  <span className="text-sm sm:text-base text-amber-700 dark:text-amber-400">
                    Please login to generate videos
                  </span>
                </div>
                <Button size="sm" onClick={() => setShowLoginDialog(true)}>
                  Login
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Upload Image</Label>
                {!uploadedImage ? (
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-primary animate-spin" />
                        <p className="text-sm sm:text-base font-medium mb-1">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm sm:text-base font-medium mb-1">Click to upload</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">PNG, JPG, WEBP (max 10MB)</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-auto max-h-48 sm:max-h-64 object-contain bg-secondary"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-prompt" className="text-sm sm:text-base">
                  Describe the animation
                </Label>
                <Textarea
                  id="image-prompt"
                  placeholder="Animate with gentle camera movement, add subtle motion..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-20 sm:min-h-24 resize-none text-sm sm:text-base"
                  disabled={isGenerating}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-duration" className="text-sm sm:text-base">
                    Duration
                  </Label>
                  <Select value={duration} onValueChange={setDuration} disabled={isGenerating}>
                    <SelectTrigger id="image-duration" className="text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="25">25s (Pro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-aspect-ratio" className="text-sm sm:text-base">
                    Aspect Ratio
                  </Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                    <SelectTrigger id="image-aspect-ratio" className="text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!uploadedImage || !prompt.trim() || isGenerating || isUploading}
                className="w-full h-10 sm:h-12 text-sm sm:text-base"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Column - Video Preview */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
          {isGenerating && (
            <Card className="p-6 sm:p-8 bg-card border-border">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base sm:text-lg font-semibold">Creating your video...</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {statusMessage || "This may take a few minutes."}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {generatedVideo && !isGenerating && (
            <Card className="p-4 sm:p-6 bg-card border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold">Generated Video</h3>
                  <Button size="sm" asChild>
                    <a href={generatedVideo} download target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
                <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
                  <video src={generatedVideo} controls className="w-full h-full object-cover">
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                    <span className="font-semibold text-foreground">Animation:</span> {prompt}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Placeholder when no video */}
          {!isGenerating && !generatedVideo && (
            <Card className="p-6 sm:p-8 bg-card/50 border-dashed border-2 border-border">
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 sm:py-12">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60" />
                </div>
                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-medium text-muted-foreground">Your video will appear here</p>
                  <p className="text-xs sm:text-sm text-muted-foreground/70">
                    Upload an image and describe the animation to create your video
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
