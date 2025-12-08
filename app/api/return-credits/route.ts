import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"


export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { currentCredits, creditsDeducted } = body

        const supabase = await createServerClient()
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error("authError: ", authError)
            // console.log("user: ", user)
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        await supabaseAdmin.from("users").update({credits: currentCredits}).eq("id", user.id)

        const {
            data: { creditHistory },
            error: historyError,
        } = await supabaseAdmin.from("credit_history").insert({
            user_id: user.id,
            amount: creditsDeducted,
            type: "refund",
            description: `Refund for invalid API response `,
        })

        if (authError) {
            return NextResponse.json({ error: "Failed to fetch user credits" }, { status: 500 })
        }

        return NextResponse.json({ creditHistory })
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
