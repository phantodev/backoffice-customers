'use client'

import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'
import '@/configs/reactotron'

export default function NavBar() {
  const router = useRouter()
  return (
    <section className="flex gap-4">
      <Button onClick={() => router.push('/dashboard/customers')}>
        Clientes
      </Button>
      <Button onClick={() => router.push('/dashboard/my-profile')}>
        Meu Perfil
      </Button>
    </section>
  )
}
