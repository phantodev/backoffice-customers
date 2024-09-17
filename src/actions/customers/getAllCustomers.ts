import { api } from '@/configs/axiosInstance'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllCustomers() {
  const response = await api.get('/customers')
  console.log(response.data)
  return response.data
}
