import { createClient } from '@supabase/supabase-js'

// 1. "!" (Exclamation Mark) ka use karein taake TypeScript khush rahay
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2. Runtime check (Agar waqayi file mein keys nahi huin toh ye error dega)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables. Check .env.local')
}

// ---------------------------------------------------------
// 3. EXPORT DEFAULT CLIENT (For Frontend)
// ---------------------------------------------------------
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ---------------------------------------------------------
// 4. EXPORT ADMIN CLIENT (For Backend API)
// ---------------------------------------------------------
export function getSupabaseAdmin() {
  // Yahan bhi "!" lagayein
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Cannot perform admin tasks.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}