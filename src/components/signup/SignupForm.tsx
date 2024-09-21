'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Card, CardBody } from '@nextui-org/card'
import { Eye, EyeSlash, Smiley } from '@phosphor-icons/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import '@/configs/reactotron'
import { useSupabase } from '@/hooks/useSupabase'
import { toast } from 'react-toastify'

interface ISignUpForm {
  name: string
  email: string
  password: string
}

const SignupSchema = z.object({
  name: z.string().min(3, { message: 'Mínimo 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(8, { message: 'Mínimo 8 caracteres' })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Pelo menos uma letra maiúscula',
    })
    .refine((password) => /[0-9]/.test(password), {
      message: 'Pelo menos um número',
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: 'A senha deve conter pelo menos um caractere especial',
    }),
})

export default function SignupForm() {
  const router = useRouter()
  const { handleSupabaseSignup } = useSupabase()
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: zodResolver(SignupSchema),
  })

  async function handleSignup(data: ISignUpForm) {
    try {
      const response = await handleSupabaseSignup(data.email, data.password)
      console.tron.log(response)
      toast.success('Cadastro efetuado com sucesso!')
      reset()
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <Card className="bg-zinc-900 w-96 p-4">
      <CardBody>
        <p className="text-2xl font-semibold">
          <Smiley /> Cadastro
        </p>
        <form
          onSubmit={handleSubmit((data: ISignUpForm) => handleSignup(data))}
          className="flex flex-col gap-4 mt-4"
        >
          <Input
            size="lg"
            type="text"
            label="Nome"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            placeholder="Digite seu nome"
            {...register('name', { required: 'Campo obrigatório' })}
          />
          <Input
            size="lg"
            type="email"
            label="Email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            placeholder="Digite seu email"
            {...register('email', { required: 'Campo obrigatório' })}
          />
          <Input
            size="lg"
            type={!showPassword ? 'password' : 'text'}
            label="Senha"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            placeholder="Digite senha"
            {...register('password', { required: 'Campo obrigatório' })}
            endContent={
              <Button isIconOnly onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={24} /> : <EyeSlash size={24} />}
              </Button>
            }
          />
          <Button type="submit" size="lg" fullWidth>
            Cadastrar
          </Button>
          <Button
            className="mt-6"
            variant="light"
            onClick={() => router.push('/')}
          >
            Já tenho cadastro
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
