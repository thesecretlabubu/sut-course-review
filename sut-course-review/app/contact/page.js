'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [refId, setRefId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด')
      setRefId(data.refId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Success Screen (matches mockup) ──
  if (refId) {
    return (
      <div className="min-h-screen bg-[#f3f4f5] flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-xl">
          {/* Brand */}
          <div className="flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-[#006b2c]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              <img src="/logo.png" alt="SUT Review Logo" className="w-9 h-9 object-contain" />
              <span>SUT Review</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden" style={{ boxShadow: '0 24px 48px -12px rgba(25,28,29,0.08)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#baecbc]/20 rounded-full -mr-16 -mt-16 blur-3xl" />

            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#baecbc] mb-8">
              <span className="material-symbols-outlined text-[#006b2c] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>

            <h1 className="text-3xl font-extrabold text-[#191c1d] mb-4 leading-tight" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              เราได้รับข้อความของคุณแล้ว
            </h1>
            <p className="text-[#6e7b6c] mb-8 leading-relaxed text-sm max-w-xs mx-auto">
              ขอบคุณที่ติดต่อสอบถามเข้ามา ทีมงานจะรีบดำเนินการตรวจสอบและตอบกลับโดยเร็ว อีเมลยืนยันถูกส่งไปที่ <strong>{form.email}</strong> แล้ว
            </p>

            {/* Reference ID */}
            <div className="bg-[#f3f4f5] rounded-xl py-3 px-6 inline-block mb-10">
              <span className="text-sm font-bold text-[#3e4a3d]">Reference ID: #{refId}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="block bg-gradient-to-r from-[#006b2c] to-[#00873a] text-white font-bold py-4 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-center">
                กลับสู่หน้าหลัก
              </Link>
              <button
                onClick={() => { setRefId(null); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="text-[#006b2c] font-semibold py-2 hover:opacity-70 transition-opacity text-sm"
              >
                ส่งข้อความเพิ่ม
              </button>
            </div>
          </div>

          {/* Contextual hint */}
          <p className="mt-10 text-center text-xs text-[#6e7b6c]/70">
            พบปัญหาในรีวิว?{' '}
            <button onClick={() => { setRefId(null); setForm({ name: '', email: '', subject: 'content', message: '' }) }}
              className="text-[#006b2c] font-semibold hover:underline">
              รายงานจากหน้านี้
            </button>
          </p>
        </div>
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-[#f3f4f5] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#191c1d] mb-3" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            ติดต่อสอบถาม
          </h1>
          <p className="text-[#6e7b6c] text-sm">
            มีคำถาม ข้อเสนอแนะ หรือพบปัญหา? ส่งข้อความมาหาเราได้เลย
          </p>
          {/*
           TODO: Add link to Facebook page 
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[#1877f2] font-semibold hover:underline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            ติดตามเราบน Facebook
          </a>
          */}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">ชื่อ-สกุล <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="ชื่อของคุณ" className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">อีเมล <span className="text-red-500">*</span></label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com" className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">หัวข้อ <span className="text-red-500">*</span></label>
              <select required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none">
                <option value="">-- เลือกหัวข้อ --</option>
                <option value="bug">รายงาน Bug</option>
                <option value="suggestion">ข้อเสนอแนะ</option>
                <option value="content">เนื้อหาไม่เหมาะสม</option>
                <option value="privacy">ข้อมูลส่วนตัว</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">ข้อความ <span className="text-red-500">*</span></label>
              <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="เล่าปัญหาหรือข้อเสนอแนะของคุณ..."
                className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#006b2c] text-white font-bold py-3 rounded-xl hover:bg-[#00873a] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading
                ? <><span className="material-symbols-outlined text-sm animate-spin">refresh</span>กำลังส่ง...</>
                : <><span className="material-symbols-outlined text-sm">send</span>ส่งข้อความ</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
