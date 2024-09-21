import { supabase } from '@/configs/supabaseClient'

export function useSupabase() {
  const handleSupabaseSignin = () => console.tron.log('FIZ O LOGIN NO SUPA')

  const handleSupabaseSignup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      throw error
    }
    return data
  }
  return { handleSupabaseSignin, handleSupabaseSignup }
}
