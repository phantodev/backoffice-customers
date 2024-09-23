'use client'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Card, CardBody } from '@nextui-org/card'
import { Eye, EyeSlash, Smiley } from '@phosphor-icons/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSupabase } from '@/actions/login/login'
import { useRouter } from 'next/navigation'
import { TStatus } from '@/interfaces/global'
import '@/configs/reactotron'

interface ILoginForm {
  email: string
  password: string
}

const LoginSchema = z.object({
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

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [status, setStatus] = React.useState<TStatus>('IDLE')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: zodResolver(LoginSchema),
  })

  async function handleLogin(data: ILoginForm) {
    try {
      setStatus('LOADING')
      console.tron.log('TESTE')
      const response = await loginSupabase(data.email, data.password)
      //       localStorage.setItem('tokenCustomers', response.token)
      //       router.push('/dashboard/customers/')
      //       console.log(response)
      if (response.session) {
        router.replace('/dashboard/customers/')
      } else {
        throw new Error('Falha ao criar sessão')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setStatus('IDLE')
    }
    console.log('Data para API: ', data)
  }

  React.useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <Card className="bg-zinc-900 w-96 p-4">
      <CardBody>
        <p className="text-2xl font-semibold">
          <Smiley /> Autenticação
        </p>
        <form
          onSubmit={handleSubmit((data: ILoginForm) => handleLogin(data))}
          className="flex flex-col gap-4 mt-4"
        >
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
          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={status === 'LOADING'}
            isDisabled={status === 'LOADING'}
          >
            {status === 'LOADING' ? '' : 'Fazer login'}
          </Button>
        </form>
        <Button
          className="mt-6"
          variant="light"
          onClick={() => router.push('/signup')}
        >
          Quero me cadastrar
        </Button>
      </CardBody>
    </Card>
  )
}
