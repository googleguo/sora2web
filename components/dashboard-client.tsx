"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, User, Video, TrendingUp, Calendar, Package, Download, Play, Clock } from "lucide-react"
import Link from "next/link"
import { HeaderClient } from "@/components/header-client"
import { FooterClient } from "@/components/footer-client"
import { cn } from "@/lib/utils"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  credits: number
  subscription_tier: string | null
  subscription_status: string | null
  subscription_expires_at: string | null
  created_at: string
}

interface Subscription {
  id: string
  tier: string
  period: string
  status: string
  credits_per_month: number
  current_period_end: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  credits_added: number
  product_name: string
  status: string
  created_at: string
}

interface CreditHistory {
  id: string
  type: string
  amount: number
  balance_after: number
  description: string
  created_at: string
}

interface VideoRecord {
  id: string
  type: "text-to-video" | "image-to-video"
  prompt: string
  video_url: string
  thumbnail_url?: string
  duration: number
  aspect_ratio: string
  model: string
  created_at: string
  image_url?: string
  video_id?: string
  status: number
  progress: string
  taskId?: string
}

interface DashboardClientProps {
  user: any
  locale: string
  dict: any
}

type TabType = "profile" | "subscription" | "credits" | "videos" | "transactions"

export function DashboardClient({ user, locale, dict }: DashboardClientProps) {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [creditHistory, setCreditHistory] = useState<CreditHistory[]>([])
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [fullName, setFullName] = useState("")
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [loadingVideos, setLoadingVideos] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (activeTab === "videos"  && !loadingVideos) {
      fetchVideoHistory()
    }
  }, [activeTab])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = `/${locale}/auth/login`
          return
        }
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data.profile)
      setSubscription(data.subscription)
      setTransactions(data.transactions)
      setCreditHistory(data.creditHistory)
      setFullName(data.profile.full_name || "")
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVideoHistory = async () => {
    setLoadingVideos(true)
    try {
      const response = await fetch("/api/user/video-history")
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
        if (data.videos && data.videos.length > 0) {
          // 为每个视频创建轮询
          data.videos.forEach((video, index) => {
            let pollInterval2: NodeJS.Timeout | null = null;
            console.log("Creating poll interval for video:", video);
            const taskId = video.task_id;
            const videoStatus = video.status;
            if (videoStatus === 0) {

              pollInterval2 = setInterval(async () => {
                try {
                  console.log("Polling status for task:", taskId);
                  const statusResponse = await fetch(`/api/check-video-status?taskId=${taskId}`);
                  const statusData = await statusResponse.json();

                  console.log("Video generation status:", statusData.state);

                  // 更新视频状态和进度
                  setVideos(prevVideos =>
                    prevVideos.map(v =>
                      v.task_id === taskId ?
                      {
                        ...v,
                        status: statusData.state === "succeeded" ? 1 : statusData.state === "error" ? 2 : 0,
                        progress: statusData.progress || v.progress || "0%",
                        video_url: statusData.videoUrl || v.video_url
                      } : v
                    )
                  );

                  if (statusData.state === "succeeded") {
                    if (pollInterval2) clearInterval(pollInterval2);
                    try {
                      await fetch("/api/user/video-history", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          type: video.type,
                          prompt:video.prompt,
                          videoUrl: statusData.videoUrl,
                          duration: video.duration,
                          aspectRatio:video.aspect_ratio,
                          model:video.model,
                          videoId: statusData.videoId || statusData.id || undefined,
                          taskId: taskId || undefined,
                          status: 1,
                        }),
                      });
                    } catch (saveErr) {
                      console.error(`${statusData.id} Error saving video to history:`, saveErr);
                    }
                  } else if (statusData.state === "error") {
                    if (pollInterval2) clearInterval(pollInterval2);
                    const creditRecord = creditHistory.find(record => record.task_id === taskId);
                    const amount1 = Math.abs(creditRecord?.amount || 0);
                    const balance = (profile?.credits || 0) + amount1;
                    await fetch("/api/return-credits", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        currentCredits: balance,
                        creditsDeducted: amount1,
                      }),
                    });
                    await fetch("/api/user/video-history", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: video.type,
                        prompt:video.prompt,
                        videoUrl: statusData.videoUrl,
                        duration: video.duration,
                        aspectRatio:video.aspect_ratio,
                        model:video.model,
                        videoId: statusData.videoId || statusData.id || undefined,
                        taskId: taskId || undefined,
                        status: 2,
                      }),
                    });
                    throw new Error(statusData.message || `${statusData.id} Video generation failed`);
                  }
                } catch (err) {
                  if (pollInterval2) clearInterval(pollInterval2);
                  // 更新视频状态为失败
                  setVideos(prevVideos =>
                    prevVideos.map(v =>
                      v.taskId === taskId ? { ...v, status: 2 } : v
                    )
                  );
                  throw err;
                }
              }, 8000);

              // 设置超时清理
              setTimeout(() => {
                if (pollInterval2) clearInterval(pollInterval2);
              }, 400000);

            }

          });
        }

      }
    } catch (error) {
      console.error("Failed to fetch video history:", error)
    } finally {
      setLoadingVideos(false)
    }
  }

  const updateProfile = async () => {
    setUpdating(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const data = await response.json()
      setProfile(data.profile)
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <HeaderClient dict={dict} user={user} />
        <div className="flex-1 container mx-auto px-4 pt-24 pb-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
        <FooterClient dict={dict} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <HeaderClient dict={dict} user={user} />
        <div className="flex-1 container mx-auto px-4 pt-24 pb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Profile not found</p>
            </CardContent>
          </Card>
        </div>
        <FooterClient dict={dict} />
      </div>
    )
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString()
  const formatDateTime = (date: string) => new Date(date).toLocaleString()

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "subscription", label: "Subscription", icon: <Package className="h-4 w-4" /> },
    { id: "credits", label: "Credits", icon: <CreditCard className="h-4 w-4" /> },
    { id: "videos", label: "Videos", icon: <Video className="h-4 w-4" /> },
    { id: "transactions", label: "Transactions", icon: <CreditCard className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderClient dict={dict} user={user} />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {profile.full_name || "User"}</p>
            </div>
            <Link href={`/${locale}/pricing`}>
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.credits}</div>
                <p className="text-xs text-muted-foreground">Use for video generation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{profile.subscription_tier || "Free"}</div>
                <p className="text-xs text-muted-foreground">
                  {subscription ? (
                    <>Status: {subscription.status}</>
                  ) : (
                    <Link href={`/${locale}/pricing`} className="text-primary hover:underline">
                      Get started
                    </Link>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDate(profile.created_at)}</div>
                <p className="text-xs text-muted-foreground">Account created</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <Card className="p-2">
                <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <Button onClick={updateProfile} disabled={updating}>
                      {updating ? "Updating..." : "Update Profile"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                    <CardDescription>Manage your subscription plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {subscription ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold capitalize">{subscription.tier} Plan</p>
                            <p className="text-sm text-muted-foreground capitalize">{subscription.period} billing</p>
                          </div>
                          <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                            {subscription.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Credits per {subscription.period}</span>
                            <span className="font-medium">{subscription.credits_per_month}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current period ends</span>
                            <span className="font-medium">{formatDate(subscription.current_period_end)}</span>
                          </div>
                        </div>
                        <div className="pt-4">
                          <Link href={`/${locale}/pricing`}>
                            <Button variant="outline">Change Plan</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No active subscription</p>
                        <Link href={`/${locale}/pricing`}>
                          <Button>Browse Plans</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Credits Tab */}
              {activeTab === "credits" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Credit History</CardTitle>
                    <CardDescription>Track your credit usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {creditHistory.length > 0 ? (
                      <div className="space-y-4">
                        {creditHistory.map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0"
                          >
                            <div className="space-y-1">
                              <p className="font-medium">{record.description}</p>
                              <p className="text-sm text-muted-foreground">{formatDateTime(record.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${record.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {record.amount >= 0 ? "+" : ""}
                                {record.amount}
                              </p>
                              <p className="text-sm text-muted-foreground">Balance: {record.balance_after}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No credit history yet</div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Videos Tab */}
              {activeTab === "videos" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Video History</CardTitle>
                    <CardDescription>View all your generated videos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingVideos ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="aspect-video rounded-lg" />
                        ))}
                      </div>
                    ) : videos.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {videos.map((video) => (
                          <Card key={video.id} className="overflow-hidden">
                            <div className="relative aspect-video bg-secondary">
                              {video.status === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-900">
                                  <div className="text-white text-lg font-medium mb-4">Video Generation in Progress</div>
                                  <div className="w-full max-w-xs">
                                    <div className="flex justify-between text-white text-sm mb-1">
                                      <span>Progress</span>
                                      <span>{video.progress || '0%'}</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                                        style={{
                                          width: `${Math.min(100, parseFloat(video.progress) || 0)}%`,
                                          // 进度完成时改变颜色
                                          backgroundColor: parseFloat(video.progress) >= 100 ? '#10B981' : '#3B82F6'
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-4 text-sm text-gray-300">
                                    Status: {video.status === 0 ? 'Generating' : video.status === 1 ? 'Completed' : 'Failed'}
                                  </div>
                                </div>
                              ) : video.status === 1 ? (
                                <>
                                  <video src={video.video_url} className="w-full h-full object-cover" preload="metadata" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="secondary" asChild>
                                      <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                                        <Play className="mr-1 h-4 w-4" />
                                        Play
                                      </a>
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-900">
                                  <div className="text-red-500 text-lg font-medium mb-2">Video Generation Failed</div>
                                  <p className="text-white text-sm text-center">
                                    Sorry, we couldn't generate your video. Please try again later.
                                  </p>
                                </div>
                              )}
                              <Badge className="absolute top-2 left-2 text-xs">
                                {video.type === "text-to-video" ? "Text" : "Image"}
                              </Badge>
                              <Badge
                                className={`absolute top-2 right-2 text-xs ${video.status === 0 ? 'bg-yellow-500' : video.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                              >
                                {video.status === 0 ? 'Generating' : video.status === 1 ? 'Completed' : 'Failed'}
                              </Badge>
                            </div>
                            <CardContent className="p-3">
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{video.prompt}</p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <span>{video.duration}s</span>
                                  <span>{video.aspect_ratio}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(video.created_at).toLocaleDateString()}
                                </div>
                              </div>

                              {/* Progress Bar for Generating Videos */}
                              {/*{video.status === 0 && (*/}
                              {/*  <div className="mt-2">*/}
                              {/*    <div className="flex justify-between text-xs text-muted-foreground mb-1">*/}
                              {/*      <span>Generation Progress: </span>*/}
                              {/*      <span>{video.progress} 111222</span>*/}
                              {/*    </div>*/}
                              {/*    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">*/}
                              {/*      <div*/}
                              {/*        className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"*/}
                              {/*        style={{ width: video.progress }}*/}
                              {/*      />*/}
                              {/*    </div>*/}
                              {/*  </div>*/}
                              {/*)}*/}

                              {/* Download Button for Completed Videos */}
                              {video.status === 1 && (
                                <div className="mt-2 flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                                    <a href={video.video_url} download target="_blank" rel="noopener noreferrer">
                                      <Download className="mr-1 h-3 w-3" />
                                      Download
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No videos generated yet</p>
                        <Link href={`/${locale}/generate`}>
                          <Button>Generate Your First Video</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Transactions Tab */}
              {activeTab === "transactions" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View your purchase history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0"
                          >
                            <div className="space-y-1">
                              <p className="font-medium">{transaction.product_name}</p>
                              <p className="text-sm text-muted-foreground">{formatDateTime(transaction.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">+{transaction.credits_added} credits</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <FooterClient dict={dict} />
    </div>
  )
}
