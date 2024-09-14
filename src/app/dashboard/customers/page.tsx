import CustomersTableList from '@/components/customers/CustomersTableList'

export default function Customers() {
  return (
    <section className="p-10">
      <h1 className="text-2xl font-bold mb-10">Lista de Clientes</h1>
      <section>
        <CustomersTableList />
      </section>
    </section>
  )
}
