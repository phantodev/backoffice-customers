'use client'

import { supabase } from '@/configs/supabaseClient'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Spinner } from '@nextui-org/spinner'

export function useAuthCheck() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/')
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        router.replace('/')
      }
    }
    checkAuth()
  }, [router])

  return isLoading
}

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoading = useAuthCheck()
  if (isLoading) {
    return (
      <section className="flex justify-center items-center w-screen h-screen">
        <Spinner size="lg" />
      </section>
    )
  }
  return <>{children}</>
}
