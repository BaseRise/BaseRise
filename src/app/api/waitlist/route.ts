import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dns from 'dns'
import { promisify } from 'util'

// DNS lookup promisify
const resolveMx = promisify(dns.resolveMx)

// DNS Check Function - Check if email domain has valid MX records
async function isValidEmailDomain(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1]
    if (!domain) return false
    
    const mxRecords = await resolveMx(domain)
    return mxRecords && mxRecords.length > 0
  } catch (error) {
    // DNS lookup failed - domain doesn't exist or has no MX records
    console.log(`❌ DNS Check Failed for: ${email}`, error)
    return false
  }
}

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
    const { email: rawEmail, referredBy: rawRef } = await request.json();

    // 🛑 LAYER 2: Sanitization & Validation
    // 1. Dangerous characters (<, >) hatana (XSS Protection)
    // 2. Trim aur lowercase karna (Data Consistency)
    const email = rawEmail?.replace(/[<>]/g, "").trim().toLowerCase();
    const referredBy = rawRef?.replace(/[<>]/g, "").trim() || null;

    // 3. Strict Regex Check (Server-side defense)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    // 🛡️ LAYER 3: DNS Check - Verify domain has valid MX records
    const isDomainValid = await isValidEmailDomain(email);
    if (!isDomainValid) {
      return NextResponse.json({ 
        error: 'Invalid email domain. Please use a real email address.' 
      }, { status: 400 });
    }

    // ... Baqi logic (Supabase calls) mein ab 'email' aur 'referredBy' variables use karein
    const origin = request.headers.get('origin');
    const siteUrl = origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://baserise.vercel.app';

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