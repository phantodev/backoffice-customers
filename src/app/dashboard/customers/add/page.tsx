import CustomerAddForm from '@/components/customers/CustomersAddForm'

export default function CustomersAddForm() {
  return (
    <section className="p-10">
      <h1 className="text-2xl font-bold mb-10">Adicionar Cliente</h1>
      <section>
        <CustomerAddForm />
      </section>
    </section>
  )
}
