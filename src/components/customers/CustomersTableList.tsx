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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllCustomers } from '@/actions/customers/getAllCustomers'
import { ICustomer } from '@/interfaces/customers'
import { PencilSimple, Trash } from '@phosphor-icons/react'
import deleteCustomer from '@/actions/customers/deleteCustomer'
import { toast } from 'react-toastify'
import { TStatus } from '@/interfaces/global'
import { Spinner } from '@nextui-org/spinner'

const columns = [
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

export default function CustomersTableList() {
  const queryClient = useQueryClient()
  const [status, setStatus] = React.useState<TStatus>('IDLE')
  const { data, isLoading, error } = useQuery<ICustomer[]>({
    queryKey: ['list-customers'],
    queryFn: getAllCustomers,
    staleTime: 60000,
    gcTime: 60000,
    refetchOnWindowFocus: true,
  })

  //   async function handleDelete(id: string) {
  //     try {
  //       await deleteCustomer(id)
  //       queryClient.refetchQueries({ queryKey: ['list-customers'] })
  //     } catch (error) {
  //       toast.error('Erro ao excluir registro!')
  //     }
  //   }

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      setStatus('LOADING')
      await deleteCustomer(id)
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['list-customers'] })
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
              <PencilSimple size={20} />
              <button onClick={() => mutation.mutate(item.id)}>
                <Trash size={20} />
              </button>
            </section>
          )
      }
      return cellValue
    },
    [mutation],
  )

  if (isLoading) {
    return <section>Carregando dados...</section>
  }

  if (error) {
    return <section>Erro ao carregar dados...</section>
  }

  return (
    <>
      <section
        className={`${status === 'LOADING' ? 'flex' : 'hidden'} fixed top-0 left-0 z-50 w-screen h-screen bg-black/50 justify-center items-center`}
      >
        <Spinner size="lg" />
      </section>
      <Table aria-label="Example table with dynamic content">
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
          items={data}
          emptyContent={
            <section className="w-full flex justify-center">
              <Image width={100} alt="Logo Nextjs" src="/assets/no-data.png" />
            </section>
          }
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
