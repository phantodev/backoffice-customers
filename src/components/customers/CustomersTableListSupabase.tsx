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
import { motion, AnimatePresence } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

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
  const [openSideBar, setOpenSidebar] = React.useState<boolean>(false)
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
                  setOpenSidebar(true)
                  //   customerStore.setCustomer(item)
                  //   router.push('/dashboard/customers/add')
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

  const filteredData = React.useMemo(() => {
    console.log('DUDUDUD')
    return data?.filter((item: ICustomer) =>
      item.name.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }, [data, filterValue])

  const onSearchChange = React.useCallback((value: string) => {
    console.log('TESTE')
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

  React.useEffect(() => {
    console.log('FILTER FOI ALTERADO')
  }, [filterValue])

  if (isLoading) {
    return (
      <section className="flex-1">
        <DotLottieReact src="/spinner.json" loop autoplay />
      </section>
    )
  }

  if (error) {
    return <section>Erro ao carregar dados...</section>
  }

  return (
    <>
      {/* <DotLottieReact src="/spinner.json" loop autoplay /> */}
      <AnimatePresence>
        {openSideBar && (
          <>
            <motion.section
              initial={{ right: '-700px' }}
              animate={{ right: 0 }}
              exit={{ right: '-700px' }}
              transition={{ duration: 0.2 }}
              className="w-[700px] h-screen fixed top-0 right-0 bg-zinc-800 z-50"
            ></motion.section>
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/50 fixed w-screen h-screen top-0 left-0 z-40"
              onClick={() => setOpenSidebar(false)}
            ></motion.section>
          </>
        )}
      </AnimatePresence>
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
              items={filteredData}
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
