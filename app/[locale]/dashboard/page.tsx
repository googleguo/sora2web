import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function DashboardPage({
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

  return <DashboardClient user={user} locale={locale} dict={dict} />
}
