'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Error({ error, reset }) {
  const pathname = usePathname()
  const lang = pathname?.split('/')[1] || 'th'

  useEffect(() => {
    console.error('Root Error Boundary:', error)
  }, [error])

  const labels = {
    th: {
      title: 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
      desc: 'ขออภัย ระบบไม่สามารถดึงข้อมูลได้ในขณะนี้ อาจเกิดจากปัญหาการเชื่อมต่อฐานข้อมูล กรุณาลองใหมีกครั้ง',
      retry: 'ลองใหม่อีกครั้ง',
      backHome: 'กลับหน้าแรก',
    },
    en: {
      title: 'Connection Error',
      desc: 'Sorry, we couldn’t fetch the data. This might be a database connection issue. Please try again.',
      retry: 'Try Again',
      backHome: 'Back to Home',
    },
    zh: {
      title: '连接错误',
      desc: '抱歉，系统暂时无法获取数据。这可能是由于数据库连接问题，请重试。',
      retry: '重试',
      backHome: '返回主页',
    }
  }

  const { title, desc, retry, backHome } = labels[lang] || labels.en

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#f3f4f5]">
      <div className="bg-white rounded-3xl p-10 md:p-16 text-center shadow-2xl max-w-lg w-full border border-[#e1e3e4]">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-[#191c1d] mb-4" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
          {title}
        </h1>
        
        <p className="text-[#6e7b6c] mb-10 leading-relaxed text-lg">
          {desc}
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-[#006b2c] text-white py-4 rounded-xl font-bold hover:bg-[#00873a] transition-all shadow-lg hover:shadow-green-100 active:scale-95"
          >
            {retry}
          </button>
          
          <Link
            href={`/${lang}`}
            className="w-full bg-[#f3f4f5] text-[#3e4a3d] py-4 rounded-xl font-bold hover:bg-[#e7e8e9] transition-all active:scale-95 text-center"
          >
            {backHome}
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 pt-8 border-t border-[#edeeef] text-left">
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Debug Info</p>
            <pre className="text-[10px] bg-slate-50 p-4 rounded-lg overflow-auto max-h-40 text-slate-500 border border-slate-100">
              {error?.message || 'Unknown error'}
              {'\n'}
              {error?.digest && `Digest: ${error.digest}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
