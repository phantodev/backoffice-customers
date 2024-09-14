import { Button } from '@nextui-org/button'
import { Image } from '@nextui-org/image'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="w-full">
      <section className="h-20 bg-zinc-800 w-full flex items-center justify-between px-4">
        <Image width={125} alt="Logo Nextjs" src="/assets/next-js.svg" />
        <section className="flex gap-4">
          <Button>Clientes</Button>
          <Button>Meu Perfil</Button>
        </section>
        <section>
          <Button>Sair</Button>
        </section>
      </section>
      {children}
    </section>
  )
}
