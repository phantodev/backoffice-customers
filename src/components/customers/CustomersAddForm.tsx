'use client'

import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Switch } from '@nextui-org/switch'
import { useForm, Controller } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { ICustomer } from '@/interfaces/customers'
import React from 'react'
import {
  formatDocument,
  getAddressByCEP,
  maskCEP,
  validateCPF,
} from '@/utils/utils'
import { useMutation } from '@tanstack/react-query'
import createCustomer from '@/actions/customers/createCustomer'
import { toast } from 'react-toastify'

export default function CustomerAddForm() {
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
      howMeet: '',
    },
  })

  //   const howMeet = watch('howMeet')

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
      await createCustomer(data)
    },
    onSuccess: () => {
      reset()
      setValue('cpf', '')
      setValue('cep', '')
      toast.success('Registro inserido!', {
        className: '!bg-success !text-white',
      })
    },
    onError: (errors) => {
      console.log(errors)
      toast.error('Erro na API!', {
        className: '!bg-danger !text-white',
      })
    },
  })

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
              label="Como nos conheceu"
              isInvalid={!!errors.howMeet}
              errorMessage={errors.howMeet?.message}
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
        <Button type="submit" color="primary">
          Enviar
        </Button>
      </form>
      <DevTool control={control} />
    </>
  )
}
