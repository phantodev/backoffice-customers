import { supabase } from '@/configs/supabaseClient'
import { ICustomer } from '@/interfaces/customers'

export default async function createCustomerSupabase(data: ICustomer) {
  const { data: insertedData, error } = await supabase
    .from('customers')
    .insert(data)
    .single()

  if (error) {
    throw error
  }

  return insertedData
}
