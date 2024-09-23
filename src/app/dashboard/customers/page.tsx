'use client'

import CustomersTableListSupabase from '@/components/customers/CustomersTableListSupabase'
import { useCustomerStore } from '@/stores/customerStore'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'

export default function Customers() {
  const customerStore = useCustomerStore()
  const router = useRouter()
  return (
    <section className="p-10">
      <section className="flex w-full justify-between">
        <h1 className="text-2xl font-bold mb-10">Lista de Clientes</h1>
        <Button
          onClick={() => {
            customerStore.customer = null
            router.push('/dashboard/customers/add')
          }}
        >
          Adicionar Cliente
        </Button>
      </section>
      <section>
        <CustomersTableListSupabase />
      </section>
    </section>
  )
}
