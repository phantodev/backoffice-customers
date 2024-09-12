export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section>
      <section>Este texto é do layout do dashboard</section>
      {children}
    </section>
  )
}
