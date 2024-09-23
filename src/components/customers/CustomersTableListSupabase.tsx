'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table'
import { Image } from '@nextui-org/image'
import { Input } from '@nextui-org/input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ICustomer } from '@/interfaces/customers'
import { MagnifyingGlass, PencilSimple, Trash } from '@phosphor-icons/react'
// import deleteCustomer from '@/actions/customers/deleteCustomer'
import { toast } from 'react-toastify'
import { TStatus } from '@/interfaces/global'
import { Spinner } from '@nextui-org/spinner'
import { useCustomerStore } from '@/stores/customerStore'
import { useRouter } from 'next/navigation'
import { getAllCustomersSupabase } from '@/actions/customers/getAllCustomersSupabase'
import deleteCustomerSupabase from '@/actions/customers/deleteCustomerSupabase'

type ColumnKey = keyof ICustomer

const columns: { key: ColumnKey; label: string }[] = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'role',
    label: 'ROLE',
  },
  {
    key: 'status',
    label: 'STATUS',
  },
  {
    key: 'actions',
    label: 'AÇÕES',
  },
]

export default function CustomersTableListSupabase() {
  const customerStore = useCustomerStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [status, setStatus] = React.useState<TStatus>('IDLE')
  const [filterValue, setFilterValue] = React.useState<string>('')
  const { data, isLoading, error, isFetching } = useQuery<ICustomer[]>({
    queryKey: ['list-customers-supabase'],
    queryFn: () => getAllCustomersSupabase(),
    staleTime: 60000,
    gcTime: 60000,
    refetchOnWindowFocus: true,
  })

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      setStatus('LOADING')
      //       await deleteCustomer(id)
      await deleteCustomerSupabase(id)
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['list-customers-supabase'] })
      setStatus('IDLE')
    },
    onError: () => {
      toast.error('Erro ao excluir registro!')
    },
  })

  const renderCell = React.useCallback(
    (item: ICustomer, columnKey: keyof ICustomer) => {
      const cellValue = item[columnKey]
      switch (columnKey) {
        case 'actions':
          return (
            <section className="flex gap-4">
              <button
                onClick={() => {
                  //   console.tron.log(customer)
                  customerStore.setCustomer(item)
                  router.push('/dashboard/customers/add')
                }}
              >
                <PencilSimple size={20} />
              </button>
              <button onClick={() => mutation.mutate(item.id)}>
                <Trash size={20} />
              </button>
            </section>
          )
      }
      return cellValue
    },
    [mutation, customerStore, router],
  )

  //   React.useEffect(() => {
  //     console.tron.log(customerStore.customer)
  //   }, [customerStore])

  const filteredData = React.useCallback(() => {
    return data?.filter((item: ICustomer) =>
      item.name.toLowerCase().includes(filterValue.toLocaleLowerCase()),
    )
  }, [data, filterValue])

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
  }, [])

  const topTableContent = React.useMemo(() => {
    return (
      <section>
        <Input
          type="text"
          label=""
          placeholder="Busque pelo nome..."
          size="lg"
          endContent={<MagnifyingGlass size={24} />}
          value={filterValue}
          onValueChange={onSearchChange}
        />
      </section>
    )
  }, [onSearchChange, filterValue])

  if (isLoading) {
    return <section>Carregando dados...</section>
  }

  if (error) {
    return <section>Erro ao carregar dados...</section>
  }

  return (
    <>
      <section
        className={`${isFetching || status === 'LOADING' ? 'flex' : 'hidden'} fixed top-0 left-0 z-50 w-screen h-screen bg-black/50 justify-center items-center`}
      >
        <Spinner size="lg" />
      </section>
      {data && data?.length > 0 && (
        <>
          <Table
            aria-label="Example table with dynamic content"
            topContent={topTableContent}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  className={column.key === 'actions' ? 'w-10' : ''}
                  key={column.key}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={filteredData()}
              emptyContent={
                <section className="w-full flex justify-center">
                  <Image
                    width={100}
                    alt="Logo Nextjs"
                    src="/assets/no-data.png"
                  />
                </section>
              }
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(item, columnKey as ColumnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}
