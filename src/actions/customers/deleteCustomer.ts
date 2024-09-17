import { api } from '@/configs/axiosInstance'

export default async function deleteCustomer(id: string) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('teste')
    }, 4000)
  })
  const response = await api.delete(`/customers/${id}`)
  return response.data
}
