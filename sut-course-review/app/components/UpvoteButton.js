'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sut_upvoted_reviews'

function getVoted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function setVoted(ids) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch {}
}

export default function UpvoteButton({ reviewId, initialUpvotes = 0 }) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [voted, setVoted_] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load voted state from localStorage on mount
  useEffect(() => {
    const voted = getVoted()
    setVoted_(voted.includes(reviewId))
  }, [reviewId])

  async function handleToggle() {
    if (loading) return
    setLoading(true)

    const action = voted ? 'remove' : 'add'
    try {
      const res = await fetch(`/api/reviews/${reviewId}/upvote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const data = await res.json()
        setUpvotes(data.upvotes)
        const current = getVoted()
        if (action === 'add') {
          setVoted(voted ? current : [...current, reviewId])
          setVoted_(true)
        } else {
          setVoted(current.filter(id => id !== reviewId))
          setVoted_(false)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={voted ? 'เอา vote ออก' : 'มีประโยชน์'}
      className={`flex items-center gap-1.5 text-xs font-bold transition-all px-2 py-1 rounded-lg ${
        voted
          ? 'text-[#006b2c] bg-[#baecbc]/50 hover:bg-[#baecbc]/80'
          : 'text-[#6e7b6c] hover:text-[#006b2c] hover:bg-[#f3f4f5]'
      } disabled:opacity-50`}
    >
      <span
        className="material-symbols-outlined text-base transition-transform"
        style={{
          fontVariationSettings: voted ? "'FILL' 1" : "'FILL' 0",
          transform: loading ? 'scale(0.8)' : 'scale(1)',
        }}
      >
        thumb_up
      </span>
      <span>มีประโยชน์ ({upvotes})</span>
    </button>
  )
}
