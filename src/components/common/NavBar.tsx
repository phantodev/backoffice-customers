'use client'

import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'
import '@/configs/reactotron'
import { easeOut, motion } from 'framer-motion'

export default function NavBar() {
  const router = useRouter()
  return (
    <motion.section
      className="flex gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5, ease: easeOut }}
    >
      <Button onClick={() => router.push('/dashboard/banners')}>Banners</Button>
      <Button onClick={() => router.push('/dashboard/infinite')}>
        Infinite
      </Button>
      <Button onClick={() => router.push('/dashboard/customers')}>
        Clientes
      </Button>
      <Button onClick={() => router.push('/dashboard/my-profile')}>
        Meu Perfil
      </Button>
    </motion.section>
  )
}
