import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HistoryClient } from "@/components/history-client"

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header dict={dict} />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{dict.History?.title || "Generation History"}</h1>
            <p className="text-muted-foreground">
              {dict.History?.welcome || "Welcome back"},{" "}
              {user.user_metadata?.full_name || user.user_metadata?.user_name || user.email}!{" "}
              {dict.History?.subtitle || "View and manage your video generation history"}
            </p>
          </div>

          <HistoryClient />
        </div>
      </main>

      <Footer dict={dict} />
    </div>
  )
}
