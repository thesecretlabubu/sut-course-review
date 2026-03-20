'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteReviewButton({ courseCode, courseId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews/my?courseCode=${encodeURIComponent(courseCode)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'เกิดข้อผิดพลาด')
      }
    } finally {
      setLoading(false)
      setConfirm(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`px-5 py-2 rounded-lg font-medium text-sm transition-all inline-flex items-center gap-1 ${
        confirm
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'border border-red-300 text-red-600 hover:bg-red-50'
      } disabled:opacity-50`}
    >
      <span className="material-symbols-outlined text-sm">
        {loading ? 'refresh' : 'delete'}
      </span>
      {loading ? 'กำลังลบ...' : confirm ? 'ยืนยันลบรีวิว?' : 'ลบรีวิวเพื่อเขียนใหม่'}
    </button>
  )
}
