"use client"

import { useEffect, useState } from "react"
import { Coins, Loader2 } from "lucide-react"

export function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCredits()
  }, [])

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/user/credits")
      if (response.ok) {
        const data = await response.json()
        setCredits(data.credits)
      }
    } catch (error) {
      console.error("[v0] Error fetching credits:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (credits === null) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
      <Coins className="w-4 h-4 text-primary" />
      <span className="text-sm font-semibold">{credits} credits</span>
    </div>
  )
}
