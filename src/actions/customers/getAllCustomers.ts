import { api } from '@/configs/axiosInstance'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllCustomers(page?: number, perPage?: string) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('teste')
    }, 4000)
  })
  let url = ''
  if (page && perPage) {
    url = `?_page=${page}&_per_page=${perPage}`
  }
  const response = await api.get(`/customers${url}`)
  console.log(response.data)
  return response.data
}
