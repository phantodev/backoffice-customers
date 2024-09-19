export interface ICustomer {
  id: string
  name: string
  role: string
  status: string
  active: boolean
  cep: string
  cpf: string
  address: string
  state: string
  howMeet: string
  actions: string
  whoIndicate: string
}

export interface IResultPaginated {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: ICustomer[]
}
