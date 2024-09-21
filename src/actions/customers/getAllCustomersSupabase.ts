import { supabase } from '@/configs/supabaseClient'
import { ICustomer } from '@/interfaces/customers'

export async function getAllCustomersSupabase(): Promise<ICustomer[]> {
  const { data, error } = await supabase.from('customers').select('*')
  if (error) {
    throw error
  }
  return data
}
