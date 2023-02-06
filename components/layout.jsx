import Head from 'next/head'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head />
      <body>{children}</body>
    </html>
  )
}
