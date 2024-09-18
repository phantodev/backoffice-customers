import { api } from '@/configs/axiosInstance'
import { ICustomer } from '@/interfaces/customers'

export default async function updateCustomer(id: string, data: ICustomer) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('teste')
    }, 4000)
  })
  const response = await api.patch(`/customers/${id}`, data)
  return response.data
}
