import { supabase } from '@/configs/supabaseClient'

export default async function deleteCustomerSupabase(id: string) {
  const { data: deletedData, error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return deletedData
}
