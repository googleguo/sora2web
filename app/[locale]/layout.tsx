import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'
import { locales } from "@/lib/i18n/config"
import { notFound } from "next/navigation"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Geist, Geist_Mono } from 'next/font/google'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "VideoForge AI - AI Video Generator | Text & Image to Video",
  description:
    "Generate stunning videos from text prompts or images with VideoForge AI. Transform your ideas into professional videos powered by advanced AI technology. Independent platform using cutting-edge AI models.",
  generator: "VideoForge AI",
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }


  return (
      <html lang={locale} suppressHydrationWarning>
      <body
          className={`${inter.className} font-sans antialiased`}
          suppressHydrationWarning
      >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        {children}
      </ThemeProvider>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      <Analytics />
      </body>
      </html>
  )
}
