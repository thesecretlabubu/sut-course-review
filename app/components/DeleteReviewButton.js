'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteReviewButton({ courseCode, courseId, lang }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const t = {
    th: {
      confirmMsg: 'ยืนยันลบรีวิว?',
      deleteLabel: 'ลบรีวิวเพื่อเขียนใหม่',
      deleting: 'กำลังลบ...',
      error: 'เกิดข้อผิดพลาด'
    },
    en: {
      confirmMsg: 'Confirm delete?',
      deleteLabel: 'Delete review to rewrite',
      deleting: 'Deleting...',
      error: 'An error occurred'
    },
    zh: {
      confirmMsg: '确认删除？',
      deleteLabel: '删除评价以重写',
      deleting: '正在删除...',
      error: '发生错误'
    }
  }[lang] || { confirmMsg: 'Confirm?', deleteLabel: 'Delete', deleting: 'Deleting...', error: 'Error' }

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
        alert(data.error || t.error)
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
      {loading ? t.deleting : confirm ? t.confirmMsg : t.deleteLabel}
    </button>
  )
}
