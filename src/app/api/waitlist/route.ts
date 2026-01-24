import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Generate unique referral code
function generateRefCode(): string {
  return 'BR' + crypto.randomBytes(4).toString('hex').toUpperCase()
}

// Supabase Admin Client
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

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // 1. Check if email already exists
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
            // 🚨 FIX: Redirect directly to frontend page
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verified`,
            shouldCreateUser: true,
          }
        })

        if (otpError) return NextResponse.json({ error: otpError.message }, { status: 500 })
        
        return NextResponse.json({ success: true, message: 'Verification email resent!' })
      }
    }

    // 2. New User - Generate Code
    const refCode = generateRefCode()

    // 3. Insert into Database (Without User ID for now)
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
      console.error('Waitlist insert error:', insertError)
      return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
    }

    // 4. Send Magic Link
    const { error: authError } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        // 🚨 FIX: Seedha verified page par bhejo
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verified`,
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