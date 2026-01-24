import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  // Verification ke baad confirmation page par bhejo (with email)
  const next = '/verified' 

  if (token_hash && type) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Token Verify karein
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error && data.user && data.user.email) {
      // Database mein Verified status True karein - EMAIL se match karo
      await supabaseAdmin
        .from('waitlist')
        .update({ 
          is_verified: true,
          user_id: data.user.id,
          verified_at: new Date().toISOString()
        })
        .eq('email', data.user.email)

      // User ko Confirmation Page par redirect karein WITH EMAIL
      const redirectTo = request.nextUrl.clone()
      redirectTo.pathname = next
      redirectTo.searchParams.delete('token_hash')
      redirectTo.searchParams.delete('type')
      redirectTo.searchParams.set('email', data.user.email)
      return NextResponse.redirect(redirectTo)
    }
  }

  // Agar fail ho jaye
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = '/error' 
  return NextResponse.redirect(redirectTo)
}