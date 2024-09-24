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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import createCustomer from '@/actions/customers/createCustomer'
import { toast } from 'react-toastify'
import { useCustomerStore } from '@/stores/customerStore'
import { TStatus } from '@/interfaces/global'
import updateCustomer from '@/actions/customers/updateCustomer'
// import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'
import { getAllCustomers } from '@/actions/customers/getAllCustomers'
import createCustomerSupabase from '@/actions/customers/createCustomerSupabase'
import AutocompleteCustom from '../common/AutcompleteCustom'
import AvatarImage from './AvatarImage'
import { supabase } from '@/configs/supabaseClient'

export default function CustomerAddForm() {
  const customerStore = useCustomerStore()
  const queryClient = useQueryClient()
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
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

  const { data, isLoading } = useQuery<ICustomer[]>({
    queryKey: ['list-customers'],
    queryFn: () => getAllCustomers(),
  })

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
        if (selectedImage) {
          const { data: uploadImage, error: uploadError } =
            await supabase.storage
              .from('customers')
              .upload(`${Date.now()}_${selectedImage?.name}`, selectedImage)
          if (uploadError) {
            throw new Error('Erro ao fazer upload')
          }

          const { data: publicUrlData } = supabase.storage
            .from('customers')
            .getPublicUrl(uploadImage.path)

          // await createCustomer(data)
          Reflect.deleteProperty(data, 'avatar')
          data.avatarUrl = publicUrlData.publicUrl
          await createCustomerSupabase(data)
        }
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

  function handleAutocompleteCustom(key: React.Key | null) {
    const whoIndicate = data?.filter((item) => item.id === String(key))
    setValue(
      'whoIndicate',
      whoIndicate && whoIndicate?.length > 0 ? whoIndicate[0].name : '',
    )
  }

  const handleImageSelected = (file: File) => {
    setValue('avatar', file)
    setSelectedImage(file)
  }

  React.useEffect(() => {
    console.tron.log('Form: ', formValue)
  }, [formValue])

  React.useEffect(() => {
    console.log('Errors: ', errors)
  }, [errors])

  return (
    <>
      <form
        onSubmit={handleSubmit(handleAddCustomer)}
        className="space-y-4 max-w-md mx-auto"
      >
        <section className="flex justify-center">
          <Controller
            name="avatar"
            control={control}
            rules={{ required: 'Campo Obrigatório' }}
            render={() => <AvatarImage onImageSelected={handleImageSelected} />}
          />
        </section>
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
          rules={{ required: 'Campo Obrigatório' }}
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
          rules={{ required: 'Campo Obrigatório' }}
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
          rules={{ required: 'Campo Obrigatório' }}
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
        {/* <Autocomplete
          label="Quem indicou este cliente?"
          placeholder="Busque pelo nome..."
          className="w-full"
          defaultItems={!isLoading && data ? data : []}
          isLoading={isLoading}
          isDisabled={isLoading}
          onSelectionChange={(value: React.Key | null) => {
            const whoIndicate = data?.filter(
              (item) => item.id === String(value),
            )
            setValue(
              'whoIndicate',
              whoIndicate && whoIndicate?.length > 0 ? whoIndicate[0].name : '',
            )
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete> */}
        <AutocompleteCustom
          isLoading={isLoading}
          data={data}
          handleAutocompleteCustom={handleAutocompleteCustom}
        />
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
