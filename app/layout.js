import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import SessionProvider from '@/app/components/SessionProvider'
import { auth } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'SUT Course Review | รีวิววิชา มทส',
  description: 'แพลตฟอร์มรีวิวรายวิชาโดยนักศึกษามหาวิทยาลัยเทคโนโลยีสุรนารี เพื่อช่วยเพื่อนๆ ตัดสินใจลงทะเบียน',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default async function RootLayout({ children }) {
  const session = await auth()
  return (
    <html lang="th" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Sarabun:wght@300;400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f3f4f5] text-[#191c1d]" suppressHydrationWarning>
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
