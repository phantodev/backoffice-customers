'use client'

import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Switch } from '@nextui-org/switch'
import { useForm, Controller, useWatch } from 'react-hook-form'
// import { DevTool } from '@hookform/devtools'
import { ICustomer } from '@/interfaces/customers'
import React from 'react'
import {
  formatDocument,
  getAddressByCEP,
  maskCEP,
  validateCPF,
} from '@/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import createCustomer from '@/actions/customers/createCustomer'
import { toast } from 'react-toastify'
import { useCustomerStore } from '@/stores/customerStore'
import { TStatus } from '@/interfaces/global'
import updateCustomer from '@/actions/customers/updateCustomer'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'

export default function CustomerAddForm() {
  const customerStore = useCustomerStore()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ICustomer>({
    mode: 'onChange',
    defaultValues: {
      active: customerStore.customer ? customerStore.customer.active : false,
      howMeet: customerStore.customer ? customerStore.customer.howMeet : '',
      status: customerStore.customer ? customerStore.customer.status : '',
      role: customerStore.customer ? customerStore.customer.role : '',
      name: customerStore.customer ? customerStore.customer.name : '',
      address: customerStore.customer ? customerStore.customer.address : '',
      state: customerStore.customer ? customerStore.customer.state : '',
      cpf: customerStore.customer ? customerStore.customer.cpf : '',
      cep: customerStore.customer ? customerStore.customer.cep : '',
    },
  })
  const [status, setStatus] = React.useState<TStatus>('IDLE')

  const animals = [
    {
      label: 'Cat',
      value: 'cat',
      description: 'The second most popular pet in the world',
    },
    {
      label: 'Dog',
      value: 'dog',
      description: 'The most popular pet in the world',
    },
    {
      label: 'Elephant',
      value: 'elephant',
      description: 'The largest land animal',
    },
    { label: 'Lion', value: 'lion', description: 'The king of the jungle' },
    { label: 'Tiger', value: 'tiger', description: 'The largest cat species' },
    {
      label: 'Giraffe',
      value: 'giraffe',
      description: 'The tallest land animal',
    },
    {
      label: 'Dolphin',
      value: 'dolphin',
      description: 'A widely distributed and diverse group of aquatic mammals',
    },
    {
      label: 'Penguin',
      value: 'penguin',
      description: 'A group of aquatic flightless birds',
    },
    {
      label: 'Zebra',
      value: 'zebra',
      description: 'A several species of African equids',
    },
    {
      label: 'Shark',
      value: 'shark',
      description:
        'A group of elasmobranch fish characterized by a cartilaginous skeleton',
    },
    {
      label: 'Whale',
      value: 'whale',
      description: 'Diverse group of fully aquatic placental marine mammals',
    },
    {
      label: 'Otter',
      value: 'otter',
      description: 'A carnivorous mammal in the subfamily Lutrinae',
    },
    {
      label: 'Crocodile',
      value: 'crocodile',
      description: 'A large semiaquatic reptile',
    },
  ]

  //   const howMeet = watch('howMeet')

  const formValue = useWatch({
    control,
  })

  const address = watch('address')

  //   console.log('HOW MEET: ', howMeet)

  async function handleAddCustomer(data: ICustomer) {
    mutation.mutate(data)
  }

  function handleCEPChange(event: React.ChangeEvent<HTMLInputElement>) {
    const maskedValue = maskCEP(event.target.value)
    setValue('cep', maskedValue)
    if (maskedValue.length === 9) {
      handleGetAddressByCEP(maskedValue)
    }
  }

  async function handleGetAddressByCEP(cep: string) {
    try {
      const response = await getAddressByCEP(cep)

      if ('localidade' in response) {
        setValue('address', response.logradouro)
        setValue('state', response.uf)
      } else {
        throw new Error('CEP não encontrado')
      }
    } catch (error) {}
  }

  function handleCPFVerification(event: React.ChangeEvent<HTMLInputElement>) {
    const maskedValue = formatDocument('CPF', event.target.value)
    setValue('cpf', maskedValue)
    if (maskedValue.length === 14 && !validateCPF(maskedValue)) {
      setError('cpf', { type: 'manual', message: 'CPF Inválido' })
    }
  }

  const mutation = useMutation({
    mutationFn: async (data: ICustomer) => {
      setStatus('LOADING')
      if (customerStore.customer) {
        await updateCustomer(customerStore.customer.id, data)
      } else {
        await createCustomer(data)
      }
    },
    onSuccess: () => {
      reset()
      setValue('cpf', '')
      setValue('cep', '')
      setValue('address', '')
      setValue('state', '')
      customerStore.setCustomer(null)
      toast.success(
        `Registro ${customerStore.customer ? 'atualizado' : 'inserido'}!`,
        {
          className: '!bg-success !text-white',
        },
      )
      queryClient.refetchQueries({ queryKey: ['list-customers'] })
      //       queryClient.invalidateQueries({ queryKey: ['list-customers'] })
    },
    onError: (errors) => {
      console.log(errors)
      toast.error('Erro na API!', {
        className: '!bg-danger !text-white',
      })
    },
    onSettled: () => {
      setStatus('IDLE')
    },
  })

  //   React.useEffect(() => {
  //     console.log(customerStore.customer)
  //     if (customerStore.customer) {
  //       setValue('cpf', customerStore.customer.cpf)
  //     }
  //   }, [customerStore, setValue])

  React.useEffect(() => {
    console.tron.log('Form: ', formValue)
  }, [formValue])

  return (
    <>
      <form
        onSubmit={handleSubmit(handleAddCustomer)}
        className="space-y-4 max-w-md mx-auto"
      >
        <div className="flex items-center space-x-2">
          <Switch {...register('active')} />
          <span>Ativo</span>
        </div>
        <Input
          label="Nome"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          {...register('name', { required: 'Campo Obrigatório' })}
        />
        <Input
          label="Cargo"
          isInvalid={!!errors.role}
          errorMessage={errors.role?.message}
          {...register('role', { required: 'Campo Obrigatório' })}
        />
        <Input
          label="Status"
          isInvalid={!!errors.status}
          errorMessage={errors.status?.message}
          {...register('status', { required: 'Campo Obrigatório' })}
        />
        <Controller
          name="cpf"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="CPF"
              maxLength={14}
              isInvalid={!!errors.cpf}
              errorMessage={errors.cpf?.message}
              onChange={(event) => {
                field.onChange(event)
                handleCPFVerification(event)
              }}
            />
          )}
        />

        <Controller
          name="cep"
          control={control}
          rules={{ required: 'Campo Obrigatório' }}
          render={({ field }) => (
            <Input
              {...field}
              label="CEP"
              isInvalid={!!errors.cep}
              errorMessage={errors.cep?.message}
              onChange={(event) => {
                field.onChange(event)
                handleCEPChange(event)
              }}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={address}
              label="Endereço"
              isInvalid={!!errors.address}
              errorMessage={errors.address?.message}
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Estado"
              isInvalid={!!errors.state}
              errorMessage={errors.state?.message}
            />
          )}
        />

        <Controller
          name="howMeet"
          control={control}
          rules={{ required: 'Campo Obrigatório' }}
          render={({ field }) => (
            <Select
              //       {...field}
              label="Como nos conheceu"
              isInvalid={!!errors.howMeet}
              errorMessage={errors.howMeet?.message}
              //       selectedKeys={
              //         customerStore.customer ? [customerStore.customer?.howMeet] : []
              //       }
              //       defaultSelectedKeys={
              //         customerStore.customer ? [customerStore.customer?.howMeet] : []
              //       }
              onSelectionChange={(keys) => {
                field.onChange(Array.from(keys)[0])
              }}
            >
              <SelectItem key="internet">Internet</SelectItem>
              <SelectItem key="amigo">Indicação de amigo</SelectItem>
              <SelectItem key="anuncio">Anúncio</SelectItem>
              <SelectItem key="outro">Outro</SelectItem>
            </Select>
          )}
        />
        <Autocomplete
          label="Favorite Animal"
          placeholder="Search an animal"
          className="w-full"
          defaultItems={animals}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
        <Button
          type="submit"
          color="primary"
          fullWidth
          size="lg"
          isDisabled={status === 'LOADING'}
          isLoading={status === 'LOADING'}
        >
          {status !== 'LOADING' ? 'Enviar' : ''}
        </Button>
      </form>
      {/* <DevTool control={control} /> */}
    </>
  )
}
