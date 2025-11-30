import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.jmaictqolfdglbdijqyf
const supabaseAnonKey = import.meta.env.sbp_5bba273dcd2479a2c55a01ad717980690eacf5b7

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing from .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)