import { api } from '@/configs/axiosInstance'
import { ICustomer } from '@/interfaces/customers'

export default async function createCustomer(data: ICustomer) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('teste')
    }, 4000)
  })
  const response = await api.post('/customers', data)
  return response.data
}
