'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/table'
import { Image } from '@nextui-org/image'
import { useQuery } from '@tanstack/react-query'
import { getAllCustomers } from '@/actions/customers/getAllCustomers'

interface ICustomers {
  key: string
  name: string
  role: string
  status: string
}

const rows = [
  {
    key: '1',
    name: 'Tony Reichert',
    role: 'CEO',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    role: 'Technical Lead',
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    role: 'Senior Developer',
    status: 'Active',
  },
  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },
]

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
]

export default function CustomersTableList() {
  const { data, isLoading, error } = useQuery<ICustomers[]>({
    queryKey: ['list-customers'],
    queryFn: getAllCustomers,
    //     staleTime: 60000,
    //     gcTime: 60000,
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return <section>Carregando dados...</section>
  }

  if (error) {
    return <section>Erro ao carregar dados...</section>
  }

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
