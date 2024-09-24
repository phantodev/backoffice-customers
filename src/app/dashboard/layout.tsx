import AuthWrapper from '@/components/common/AuthWrapper'
import LogoutButton from '@/components/common/LogoutButton'
import NavBar from '@/components/common/NavBar'
import { Image } from '@nextui-org/image'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthWrapper>
      <section className="w-full flex flex-col">
        <section className="h-20 bg-zinc-800 w-full flex items-center justify-between px-4">
          <Image width={125} alt="Logo Nextjs" src="/assets/next-js.svg" />
          <NavBar />
          <LogoutButton />
        </section>
        {children}
      </section>
    </AuthWrapper>
  )
}
