import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// ... (Helper functions same rahengi)
function generateRefCode(): string {
  return 'BR' + crypto.randomBytes(4).toString('hex').toUpperCase()
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { email, referredBy } = await request.json()

    // 🧠 LOGIC START: Dynamic URL Detection
    // 1. Request ke header se poocho "Tum kahan se aaye ho?"
    const origin = request.headers.get('origin')
    
    // 2. Agar origin hai (e.g., http://localhost:3000) toh wo use karo, 
    // warna environment variable uthao.
    const siteUrl = origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://baserise.vercel.app'
    
    console.log(`📡 Request from: ${origin}, Redirecting to: ${siteUrl}/verified`) 
    // (Ye console log Vercel logs mein debugging ke liye help karega)
    // 🧠 LOGIC END

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // 1. Check Existing User
    const { data: existingUser } = await supabaseAdmin
      .from('waitlist')
      .select('email, is_verified, ref_code')
      .eq('email', email)
      .single()

    if (existingUser) {
      if (existingUser.is_verified) {
        return NextResponse.json({ 
          error: 'This email is already verified!',
          refCode: existingUser.ref_code 
        }, { status: 400 })
      } else {
        // Resend Magic Link
        const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
          email,
          options: {
            // 👇 Yahan humne Dynamic URL use kiya
            emailRedirectTo: `${siteUrl}/verified`,
            shouldCreateUser: true,
          }
        })

        if (otpError) return NextResponse.json({ error: otpError.message }, { status: 500 })
        return NextResponse.json({ success: true, message: 'Verification email resent!' })
      }
    }

    // 2. Create New User Logic
    const refCode = generateRefCode()

    const { error: insertError } = await supabaseAdmin
      .from('waitlist')
      .insert({
        email,
        referred_by: referredBy || null,
        ref_code: refCode,
        is_verified: false,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
    }

    // 3. Send Magic Link (New User)
    const { error: authError } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        // 👇 Yahan bhi Dynamic URL
        emailRedirectTo: `${siteUrl}/verified`,
        shouldCreateUser: true,
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Check your email for verification link!'
    })

  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}