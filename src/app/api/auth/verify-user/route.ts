import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Admin client banayein kyunke database update karne ke liye bypass RLS chahiye server par
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json()

    // 1. Session Validation (The Security Guard) 🛡️
    // Hum header se access token nikal kar check karenge
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: "No session token found" }, { status: 401 })
    }

    // Supabase se pucho ke ye token kiska hai
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // 2. ID Spoofing Check 🚫
    // Check karo ke bhejney wala wahi email verify kar raha hai jo uska apna hai
    if (user.email !== email || user.id !== userId) {
      return NextResponse.json({ error: "Spoofing detected! You can only verify your own account." }, { status: 403 })
    }

    // 3. Final Database Update
    const { error: dbError } = await supabaseAdmin
      .from('waitlist')
      .update({ 
        is_verified: true,
        user_id: user.id 
      })
      .eq('email', user.email)

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Security check passed. User verified." })

  } catch (error) {
    console.error("Verification API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}