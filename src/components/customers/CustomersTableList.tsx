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
import { getAllCustomers } from '@/actions/customers/getAllCustomers'
import { ICustomer, IResultPaginated } from '@/interfaces/customers'
import { MagnifyingGlass, PencilSimple, Trash } from '@phosphor-icons/react'
import deleteCustomer from '@/actions/customers/deleteCustomer'
import { toast } from 'react-toastify'
import { TStatus } from '@/interfaces/global'
import { Spinner } from '@nextui-org/spinner'
import { useCustomerStore } from '@/stores/customerStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@nextui-org/pagination'
import { RadioGroup, Radio } from '@nextui-org/radio'

// type ColumnKey = keyof ICustomer

interface IColumnKey {
  id: string
  name: string
  role: string
  status: string
  actions: string
}

const columns: { key: keyof IColumnKey; label: string }[] = [
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
  const customerStore = useCustomerStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [status, setStatus] = React.useState<TStatus>('IDLE')
  const [page, setPage] = React.useState<number>(
    Number(searchParams.get('page')) || 1,
  )
  const [perPage, setPerPage] = React.useState<string>(
    searchParams.get('perPage') || '4',
  )
  const [filterValue, setFilterValue] = React.useState<string>('')
  const { data, isLoading, error, isFetching } = useQuery<IResultPaginated>({
    queryKey: ['list-customers', page, perPage],
    queryFn: () => getAllCustomers(page, perPage),
    staleTime: 60000,
    gcTime: 60000,
    refetchOnWindowFocus: true,
    placeholderData: (previousData) => previousData,
  })

  useQuery<ICustomer[]>({
    queryKey: ['list-customers'],
    queryFn: () => getAllCustomers(),
    staleTime: 60000,
    gcTime: 60000,
  })

  const updateURLState = React.useCallback(
    (newPage: number, newPerPage: string) => {
      console.tron.log('ENTROU NO URL STATE')
      const params = new URLSearchParams(searchParams)
      params.set('page', newPage.toString())
      params.set('perPage', newPerPage)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateURLState(newPage, perPage)
  }

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(newPerPage)
    setPage(1)
    updateURLState(1, newPerPage)
  }

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
    (item: ICustomer, columnKey: keyof IColumnKey) => {
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
    return data?.data.filter((item: ICustomer) =>
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

  const bottomTableContent = React.useMemo(() => {
    return (
      <section className="flex justify-between w-full mt-6">
        <section className="flex justify-center">
          Mostrando de {(page - 1) * Number(perPage) + 1} a{' '}
          {Number(perPage) * page} de {data?.items} registros
        </section>
        <section>
          <RadioGroup
            label=""
            value={perPage}
            orientation="horizontal"
            onValueChange={(value: string) => handlePerPageChange(value)}
          >
            <Radio value="4">4</Radio>
            <Radio value="8">8</Radio>
          </RadioGroup>
        </section>
      </section>
    )
  }, [page, perPage, data, handlePerPageChange])

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
      {data && data?.data?.length > 0 && (
        <>
          <Table
            aria-label="Example table with dynamic content"
            topContent={topTableContent}
            bottomContent={bottomTableContent}
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
                      {renderCell(item, columnKey as keyof IColumnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <section className="w-full flex justify-center mt-10">
            <Pagination
              isCompact
              showControls
              total={data.pages}
              page={page}
              initialPage={1}
              size="lg"
              onChange={(page: number) => handlePageChange(page)}
            />
          </section>
        </>
      )}
    </>
  )
}
