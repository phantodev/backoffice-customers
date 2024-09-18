'use client'

import CustomerAddForm from '@/components/customers/CustomersAddForm'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'

export default function CustomersAddFormPage() {
  const router = useRouter()
  return (
    <section className="p-10">
      <section className="flex w-full justify-between">
        <h1 className="text-2xl font-bold mb-10">Adicionar Cliente</h1>
        <Button onClick={() => router.push('/dashboard/customers')}>
          Lista de clientes
        </Button>
      </section>
      <section>
        <CustomerAddForm />
      </section>
    </section>
  )
}
