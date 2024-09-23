'use client'

import { supabase } from '@/configs/supabaseClient'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <section>
      <Button onClick={handleLogout}>Sair</Button>
    </section>
  )
}
