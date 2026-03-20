'use client'

import { useState } from 'react'

const REASONS = [
  { value: 'inappropriate', label: 'เนื้อหาไม่เหมาะสม / หยาบคาย' },
  { value: 'spam', label: 'Spam หรือโฆษณา' },
  { value: 'misleading', label: 'ข้อมูลเท็จ / ทำให้เข้าใจผิด' },
  { value: 'other', label: 'อื่นๆ' },
]

export default function ReportButton({ reviewId, courseCode }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!reason) return
    setLoading(true)
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, courseCode, reason, detail }),
      })
      setDone(true)
      setTimeout(() => { setOpen(false); setDone(false); setReason(''); setDetail('') }, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">flag</span>
        รายงาน
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {done ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-5xl text-[#006b2c] block mb-3">check_circle</span>
                <p className="font-bold text-[#191c1d]">ขอบคุณ!</p>
                <p className="text-sm text-slate-500 mt-1">รายงานถูกส่งแล้ว ทีมงานจะตรวจสอบโดยเร็ว</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#191c1d] flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-xl">flag</span>
                    รายงานรีวิวนี้
                  </h3>
                  <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <p className="text-sm text-slate-500">เลือกเหตุผลที่คุณต้องการรายงาน:</p>

                <div className="space-y-2">
                  {REASONS.map(r => (
                    <label key={r.value} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${reason === r.value ? 'border-[#006b2c] bg-[#baecbc]/20' : 'border-[#e1e3e4] hover:border-[#006b2c]/40'}`}>
                      <input type="radio" name="reason" value={r.value} checked={reason === r.value}
                        onChange={() => setReason(r.value)} className="accent-[#006b2c]" />
                      <span className="text-sm text-[#3e4a3d]">{r.label}</span>
                    </label>
                  ))}
                </div>

                {reason === 'other' && (
                  <textarea
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                    rows={3}
                    className="w-full bg-[#f3f4f5] rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-[#006b2c] outline-none"
                  />
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#e1e3e4] text-slate-500 text-sm font-medium hover:bg-[#f3f4f5]">
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={!reason || loading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? <><span className="material-symbols-outlined text-sm animate-spin">refresh</span>กำลังส่ง</> : 'ส่งรายงาน'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
