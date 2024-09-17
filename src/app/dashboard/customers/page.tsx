'use client'

import CustomersTableList from '@/components/customers/CustomersTableList'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'

export default function Customers() {
  const router = useRouter()
  return (
    <section className="p-10">
      <section className="flex w-full justify-between">
        <h1 className="text-2xl font-bold mb-10">Lista de Clientes</h1>
        <Button onClick={() => router.push('/dashboard/customers/add')}>
          Adicionar Cliente
        </Button>
      </section>
      <section>
        <CustomersTableList />
      </section>
    </section>
  )
}
