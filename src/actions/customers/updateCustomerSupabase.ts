import { supabase } from '@/configs/supabaseClient'
import { ICustomer } from '@/interfaces/customers'

export default async function updateCustomerSupabase(
  id: string,
  data: ICustomer,
) {
  const { data: updateData, error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return updateData
}
