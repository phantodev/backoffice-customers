import { api } from '@/configs/axiosInstance'
import { ICustomer } from '@/interfaces/customers'

export default async function createCustomer(data: ICustomer) {
  const response = await api.post('/customers', data)
  return response.data
}
