'use client'

import Link from 'next/link'

export default function CoursesError({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f5] p-8">
      <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-sm">
        <span className="material-symbols-outlined text-5xl text-red-400 block mb-4">error</span>
        <h2 className="text-xl font-bold text-[#191c1d] mb-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
          เกิดข้อผิดพลาด
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {error?.message || 'ไม่สามารถโหลดข้อมูลวิชาได้ กรุณาลองใหม่อีกครั้ง'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#006b2c] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#00873a] transition-all text-sm"
          >
            ลองใหม่
          </button>
          <Link href="/" className="border border-[#e1e3e4] text-slate-600 px-6 py-2 rounded-lg font-medium hover:bg-[#f3f4f5] transition-all text-sm">
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  )
}
