import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

// Cliente público (para el navegador)
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    }
    return supabaseInstance ? (supabaseInstance as any)[prop] : undefined
  },
})

// Cliente de servidor con permisos completos (solo en API routes)
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    if (!supabaseAdminInstance && supabaseUrl && supabaseServiceKey) {
      supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey)
    }
    return supabaseAdminInstance ? (supabaseAdminInstance as any)[prop] : undefined
  },
})
