'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactForm({ lang, dict }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [refId, setRefId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const t = dict.contact

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
      if (!res.ok) throw new Error(data.error || 'Error occurred')
      setRefId(data.refId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const successTextMap = {
    th: {
      title: 'เราได้รับข้อความของคุณแล้ว',
      desc: 'ขอบคุณที่ติดต่อสอบถามเข้ามา ทีมงานจะรีบดำเนินการตรวจสอบและตอบกลับโดยเร็ว อีเมลยืนยันถูกส่งไปที่ ',
      backHome: 'กลับสู่หน้าหลัก',
      sendMore: 'ส่งข้อความเพิ่ม'
    },
    en: {
      title: 'Message Received!',
      desc: 'Thank you for reaching out. Our team will review and respond shortly. A confirmation email has been sent to ',
      backHome: 'Back to Home',
      sendMore: 'Send another'
    },
    zh: {
      title: '信息已收到！',
      desc: '感谢您的联系。我们的团队将尽快审核并回复。确认邮件已发送至 ',
      backHome: '返回主页',
      sendMore: '再发一条'
    }
  }
  const successText = successTextMap[lang] || successTextMap.en

  const subjectOptionsMap = {
    th: [
      { value: 'bug', label: 'รายงาน Bug' },
      { value: 'suggestion', label: 'ข้อเสนอแนะ' },
      { value: 'content', label: 'เนื้อหาไม่เหมาะสม' },
      { value: 'privacy', label: 'ข้อมูลส่วนตัว' },
      { value: 'other', label: 'อื่นๆ' },
    ],
    en: [
      { value: 'bug', label: 'Report a Bug' },
      { value: 'suggestion', label: 'Suggestion' },
      { value: 'content', label: 'Inappropriate Content' },
      { value: 'privacy', label: 'Privacy Concerns' },
      { value: 'other', label: 'Other' },
    ],
    zh: [
      { value: 'bug', label: '报告 Bug' },
      { value: 'suggestion', label: '建议' },
      { value: 'content', label: '不当内容' },
      { value: 'privacy', label: '隐私问题' },
      { value: 'other', label: '其他' },
    ]
  }
  const subjectOptions = subjectOptionsMap[lang] || subjectOptionsMap.en

  if (refId) {
    return (
      <div className="min-h-screen bg-[#f3f4f5] flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-xl">
          {/* Brand */}
          <div className="flex justify-center mb-10">
            <Link href={`/${lang}`} className="flex items-center gap-2 text-2xl font-extrabold text-[#006b2c]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
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
              {successText.title}
            </h1>
            <p className="text-[#6e7b6c] mb-8 leading-relaxed text-sm max-w-xs mx-auto">
              {successText.desc} <strong>{form.email}</strong>
            </p>

            {/* Reference ID */}
            <div className="bg-[#f3f4f5] rounded-xl py-3 px-6 inline-block mb-10">
              <span className="text-sm font-bold text-[#3e4a3d]">Reference ID: #{refId}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <Link href={`/${lang}`} className="block bg-gradient-to-r from-[#006b2c] to-[#00873a] text-white font-bold py-4 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-center">
                {successText.backHome}
              </Link>
              <button
                onClick={() => { setRefId(null); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="text-[#006b2c] font-semibold py-2 hover:opacity-70 transition-opacity text-sm"
              >
                {successText.sendMore}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f4f5] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#191c1d] mb-3" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            {t.title}
          </h1>
          <p className="text-[#6e7b6c] text-sm">
            {t.subtitle}
          </p>
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
                <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">{lang === 'th' ? 'ชื่อ-สกุล' : lang === 'zh' ? '姓名' : 'Full Name'} <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder={lang === 'th' ? 'ชื่อของคุณ' : 'Your name'} className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">{t.emailLabel} <span className="text-red-500">*</span></label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com" className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">{t.subjectLabel} <span className="text-red-500">*</span></label>
              <select required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none">
                <option value="">-- {lang === 'th' ? 'เลือกหัวข้อ' : lang === 'zh' ? '选择主题' : 'Select Subject'} --</option>
                {subjectOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e4a3d] mb-1.5">{t.messageLabel} <span className="text-red-500">*</span></label>
              <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder={lang === 'th' ? 'เล่าปัญหาหรือข้อเสนอแนะของคุณ...' : 'Share your issue or feedback...'}
                className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#006b2c] text-white font-bold py-3 rounded-xl hover:bg-[#00873a] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {loading
                ? <><span className="material-symbols-outlined text-sm animate-spin">refresh</span>{lang === 'th' ? 'กำลังส่ง...' : 'Sending...'}</>
                : <><span className="material-symbols-outlined text-sm">send</span>{t.sendBtn}</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
