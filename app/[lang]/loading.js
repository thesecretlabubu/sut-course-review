'use client'

import { usePathname } from 'next/navigation'

export default function Loading() {
  const pathname = usePathname()
  const lang = pathname?.split('/')[1] || 'th'

  const labels = {
    th: { title: 'กำลังโหลดข้อมูล...', subtitle: 'กรุณารอสักครู่ ระบบกำลังเชื่อมต่อฐานข้อมูล' },
    en: { title: 'Loading...', subtitle: 'Please wait while we connect to the database' },
    zh: { title: '正在加载...', subtitle: '请稍候，系统正在连接数据库' }
  }

  const { title, subtitle } = labels[lang] || labels.en

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-[#f3f4f5]">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-[#006b2c]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#006b2c] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold text-[#191c1d] animate-pulse" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
        {title}
      </h2>
      <p className="text-[#6e7b6c] mt-2 text-sm">{subtitle}</p>
    </div>
  )
}
