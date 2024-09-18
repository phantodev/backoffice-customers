import { ICustomer } from '@/interfaces/customers'
import { create } from 'zustand'

interface ICustomerStore {
  customer: ICustomer | null
  setCustomer: (customer: ICustomer | null) => void
}

export const useCustomerStore = create<ICustomerStore>((set) => ({
  customer: null,
  setCustomer: (customer: ICustomer | null) => set({ customer }),
}))
