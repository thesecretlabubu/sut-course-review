'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ─────────────────────── constants ─────────────────────── */
const CATEGORIES = ['วิทยาศาสตร์และเทคโนโลยี', 'มนุษยศาสตร์', 'สังคมศาสตร์', 'ภาษา']
const REASON_LABELS = { inappropriate: 'ไม่เหมาะสม', spam: 'Spam', misleading: 'ข้อมูลเท็จ', other: 'อื่นๆ' }

const NAV = [
  { id: 'overview',  label: 'ภาพรวม',         icon: 'dashboard' },
  { id: 'reports',   label: 'รายงานรีวิว',     icon: 'flag' },
  { id: 'reviews',   label: 'รีวิวทั้งหมด',    icon: 'rate_review' },
  { id: 'courses',   label: 'จัดการวิชา',      icon: 'school' },
  { id: 'contacts',  label: 'ข้อความติดต่อ',   icon: 'mail' },
]

/* ─────────────────────── helpers ─────────────────────── */
function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#006b2c] text-white'}`}>
      <span className="material-symbols-outlined text-base">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
      {toast.msg}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-[#191c1d]">{value}</p>
        <p className="text-xs text-[#6e7b6c] mt-0.5">{label}</p>
      </div>
    </div>
  )
}

/* ─────────────────────── main component ─────────────────────── */
export default function AdminClient({ adminName, adminEmail }) {
  const [tab, setTab]                 = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats]             = useState(null)
  const [reports, setReports]         = useState([])
  const [reviews, setReviews]         = useState([])
  const [courses, setCourses]         = useState([])
  const [contacts, setContacts]       = useState([])
  const [reviewFilter, setReviewFilter] = useState('')
  const [reviewPage, setReviewPage]   = useState(1)
  const [reviewTotal, setReviewTotal] = useState(0)
  const [reviewPages, setReviewPages] = useState(1)
  const [courseSearch, setCourseSearch] = useState('')
  const [courseForm, setCourseForm]   = useState(null)
  const [courseFormData, setCourseFormData] = useState({ code: '', name: '', category: CATEGORIES[0], description: '', credits: 3 })
  const [loading, setLoading]         = useState(false)
  const [toast, setToast]             = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── Data loaders ── */
  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats)
  }, [])

  useEffect(() => {
    if (tab === 'reports') {
      setLoading(true)
      fetch('/api/reports?resolved=false').then(r => r.json()).then(d => { setReports(Array.isArray(d) ? d : []); setLoading(false) })
    }
    if (tab === 'contacts') {
      setLoading(true)
      fetch('/api/admin/contacts').then(r => r.json()).then(d => { setContacts(Array.isArray(d) ? d : []); setLoading(false) })
    }
  }, [tab])

  const loadReviews = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (reviewFilter) p.set('courseCode', reviewFilter)
    p.set('page', reviewPage)
    fetch(`/api/admin/reviews?${p}`).then(r => r.json()).then(d => {
      setReviews(d.reviews || [])
      setReviewTotal(d.total || 0)
      setReviewPages(d.pages || 1)
      setLoading(false)
    })
  }, [reviewFilter, reviewPage])
  useEffect(() => { if (tab === 'reviews') loadReviews() }, [tab, loadReviews])

  const loadCourses = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/courses').then(r => r.json()).then(d => { setCourses(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])
  useEffect(() => { if (tab === 'courses') loadCourses() }, [tab, loadCourses])

  /* ── Actions ── */
  async function deleteReview(id) {
    if (!confirm('ลบรีวิวนี้?')) return
    const res = await fetch(`/api/admin/reviews?reviewId=${id}`, { method: 'DELETE' })
    if (res.ok) { setReviews(r => r.filter(x => x._id !== id)); setStats(s => s ? { ...s, totalReviews: s.totalReviews - 1 } : s); showToast('ลบรีวิวแล้ว') }
    else showToast('เกิดข้อผิดพลาด', 'error')
  }

  async function resolveReport(reportId) {
    await fetch(`/api/admin/resolve?reportId=${reportId}`, { method: 'POST' })
    setReports(r => r.filter(x => x._id !== reportId))
    setStats(s => s ? { ...s, pendingReports: s.pendingReports - 1 } : s)
    showToast('ปิดรายงานแล้ว')
  }

  async function deleteFromReport(reportId, reviewId) {
    if (!confirm('ลบรีวิวนี้ออกจากระบบ?')) return
    await fetch(`/api/admin/delete-review?reportId=${reportId}&reviewId=${reviewId}`, { method: 'POST' })
    setReports(r => r.filter(x => x._id !== reportId))
    setStats(s => s ? { ...s, pendingReports: s.pendingReports - 1, totalReviews: s.totalReviews - 1 } : s)
    showToast('ลบรีวิวแล้ว')
  }

  async function saveCourse(e) {
    e.preventDefault()
    setLoading(true)
    const isNew = courseForm === 'new'
    try {
      const res = await fetch(isNew ? '/api/admin/courses' : `/api/admin/courses/${courseForm._id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseFormData),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || 'เกิดข้อผิดพลาด', 'error'); return }
      setCourseForm(null)
      loadCourses()
      setStats(s => s ? { ...s, totalCourses: isNew ? s.totalCourses + 1 : s.totalCourses } : s)
      showToast(isNew ? 'เพิ่มวิชาแล้ว' : 'แก้ไขแล้ว')
    } finally { setLoading(false) }
  }

  async function deleteCourse(id) {
    if (!confirm('ลบวิชาและรีวิวทั้งหมด?')) return
    const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    if (res.ok) { setCourses(c => c.filter(x => x._id !== id)); setStats(s => s ? { ...s, totalCourses: s.totalCourses - 1 } : s); showToast('ลบวิชาแล้ว') }
    else showToast('เกิดข้อผิดพลาด', 'error')
  }

  const filteredCourses = courses.filter(c =>
    !courseSearch || c.code.toLowerCase().includes(courseSearch.toLowerCase()) || c.name.toLowerCase().includes(courseSearch.toLowerCase())
  )

  /* ── Sidebar nav item ── */
  function NavItem({ id, label, icon, badge }) {
    const active = tab === id
    return (
      <button onClick={() => { setTab(id); setSidebarOpen(false) }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${active ? 'bg-[#006b2c] text-white shadow-md shadow-[#006b2c]/20' : 'text-[#3e4a3d] hover:bg-[#f3f4f5]'}`}>
        <span className="material-symbols-outlined text-xl flex-shrink-0" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
        <span className="flex-1">{label}</span>
        {badge > 0 && <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{badge}</span>}
      </button>
    )
  }

  /* ── Sidebar ── */
  const Sidebar = (
    <aside className="flex flex-col h-full bg-white border-r border-[#e1e3e4]">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-[#e1e3e4]">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="SUT Review Logo" className="w-7 h-7 object-contain" />
          <div>
            <p className="font-extrabold text-[#191c1d] text-sm leading-tight" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>SUT Course Review</p>
            <p className="text-[10px] text-[#6e7b6c]">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(n => (
          <NavItem key={n.id} id={n.id} label={n.label} icon={n.icon}
            badge={n.id === 'reports' ? (stats?.pendingReports || 0) : 0} />
        ))}
      </nav>

      {/* User card */}
      <div className="px-4 py-4 border-t border-[#e1e3e4]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#006b2c] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {adminName?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#191c1d] truncate">{adminName}</p>
            <p className="text-[10px] text-[#6e7b6c] truncate">{adminEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  )

  /* ── Page header ── */
  const currentTab = NAV.find(n => n.id === tab)

  return (
    <div className="flex h-screen bg-[#f3f4f5] overflow-hidden">
      <Toast toast={toast} />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full">
        {Sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex-shrink-0 flex flex-col h-full z-50">
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-[#e1e3e4] flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-[#f3f4f5]">
            <span className="material-symbols-outlined text-[#191c1d]">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006b2c] text-xl">{currentTab?.icon}</span>
            <h1 className="font-extrabold text-[#191c1d] text-lg" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              {currentTab?.label}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-[#6e7b6c] hover:text-[#006b2c] transition-colors font-medium">
              <span className="material-symbols-outlined text-base">open_in_new</span>
              ดูหน้าเว็บ
            </Link>
          </div>
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ══════ OVERVIEW ══════ */}
          {tab === 'overview' && (
            <div className="space-y-6 max-w-5xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon="school"       label="วิชาทั้งหมด"           value={stats?.totalCourses   ?? '…'} color="text-blue-600 bg-blue-50" />
                <StatCard icon="rate_review"  label="รีวิวทั้งหมด"          value={stats?.totalReviews   ?? '…'} color="text-[#006b2c] bg-[#baecbc]/40" />
                <StatCard icon="flag"         label="รายงานรอดำเนินการ"     value={stats?.pendingReports ?? '…'} color="text-red-600 bg-red-50" />
                <StatCard icon="mail"         label="ข้อความติดต่อ"         value={stats?.totalContacts  ?? '…'} color="text-emerald-600 bg-emerald-50" />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#191c1d] mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#006b2c]">bolt</span>
                  การดำเนินการด่วน
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: `ดูรายงาน (${stats?.pendingReports ?? 0})`, icon: 'flag', tab: 'reports', color: 'bg-red-50 text-red-700 hover:bg-red-100' },
                    { label: 'เพิ่มวิชาใหม่', icon: 'add', tab: 'courses', color: 'bg-[#baecbc]/40 text-[#006b2c] hover:bg-[#baecbc]/70' },
                    { label: 'จัดการรีวิว', icon: 'rate_review', tab: 'reviews', color: 'bg-[#f3f4f5] text-[#3e4a3d] hover:bg-[#e7e8e9]' },
                    { label: 'ข้อความติดต่อ', icon: 'mail', tab: 'contacts', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                  ].map(a => (
                    <button key={a.tab} onClick={() => { setTab(a.tab); if (a.tab === 'courses') setTimeout(() => { setCourseForm('new'); setCourseFormData({ code: '', name: '', category: CATEGORIES[0], description: '', credits: 3 }) }, 100) }}
                      className={`flex items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl transition-all ${a.color}`}>
                      <span className="material-symbols-outlined text-base">{a.icon}</span>{a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════ REPORTS ══════ */}
          {tab === 'reports' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6e7b6c]">{loading ? 'กำลังโหลด…' : `${reports.length} รายการ`}</p>
              </div>
              {loading ? <LoadingSpinner /> : reports.length === 0 ? <EmptyState icon="check_circle" label="ไม่มีรายงานที่รอดำเนินการ" /> : reports.map(rep => (
                <div key={rep._id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-400">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">{REASON_LABELS[rep.reason] || rep.reason}</span>
                      {rep.detail && <span className="text-xs text-slate-400 ml-2">"{rep.detail}"</span>}
                      <p className="text-xs text-slate-400 mt-1.5">{rep.reportedAt ? new Date(rep.reportedAt).toLocaleString('th-TH') : ''}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => resolveReport(rep._id)} className="text-xs bg-[#baecbc] text-[#006b2c] font-bold px-3 py-1.5 rounded-lg hover:bg-[#006b2c] hover:text-white transition-all">✓ ปิดรายงาน</button>
                      <button onClick={() => deleteFromReport(rep._id, rep.reviewId)} className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all">🗑 ลบรีวิว</button>
                    </div>
                  </div>
                  {rep.review ? (
                    <div className="bg-[#f3f4f5] rounded-xl p-4 text-sm">
                      <p className="font-bold text-[#191c1d] mb-1">วิชา {rep.review.courseCode} · {rep.review.isAnonymous ? 'ไม่ระบุชื่อ' : (rep.review.userName || 'ไม่ทราบชื่อ')}</p>
                      <p className="text-[#3e4a3d] italic">"{rep.review.comment || '(ไม่มีความคิดเห็น)'}"</p>
                      <p className="text-xs text-slate-400 mt-2">เทอม {rep.review.semester} · เกรด {rep.review.gradeReceived} · สนุก {rep.review.ratingFun} · งาน {rep.review.ratingWorkload} · ยาก {rep.review.ratingDifficulty}</p>
                    </div>
                  ) : <p className="text-sm text-slate-400 italic bg-[#f3f4f5] rounded-xl px-4 py-3">รีวิวนี้ถูกลบไปแล้ว</p>}
                </div>
              ))}
            </div>
          )}

          {/* ══════ REVIEWS ══════ */}
          {tab === 'reviews' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input value={reviewFilter} onChange={e => { setReviewFilter(e.target.value); setReviewPage(1) }}
                    placeholder="ค้นหาด้วยรหัสวิชา..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e1e3e4] rounded-xl text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
                </div>
                <button onClick={loadReviews} className="flex items-center gap-1.5 text-xs text-[#006b2c] font-bold px-3 py-2.5 bg-[#baecbc]/40 rounded-xl hover:bg-[#baecbc]/70 transition-all">
                  <span className="material-symbols-outlined text-sm">refresh</span>รีเฟรช
                </button>
                <p className="text-sm text-[#6e7b6c]">{loading ? '…' : `${reviewTotal} รีวิว`}</p>
              </div>

              {loading ? <LoadingSpinner /> : reviews.length === 0 ? <EmptyState icon="rate_review" label="ไม่พบรีวิว" /> : (
                <div className="space-y-3">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm text-[#006b2c] bg-[#baecbc]/40 px-2 py-0.5 rounded-lg">{r.courseCode}</span>
                          <span className="text-sm text-[#191c1d]">{r.isAnonymous ? 'ไม่ระบุชื่อ' : (r.userName || r.userEmail || 'ไม่ทราบ')}</span>
                          <span className="text-xs bg-[#e7e8e9] px-2 py-0.5 rounded-full">{r.gradeReceived}</span>
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">เทอม {r.semester}</span>
                        </div>
                        <p className="text-sm text-[#3e4a3d] line-clamp-2 mt-1">"{r.comment || '(ไม่มีความคิดเห็น)'}"</p>
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-3">
                          <span>⭐ สนุก {r.ratingFun}</span>
                          <span>📚 งาน {r.ratingWorkload}</span>
                          <span>🎯 ยาก {r.ratingDifficulty}</span>
                          <span>· {r.createdAt ? new Date(r.createdAt).toLocaleDateString('th-TH') : ''}</span>
                        </p>
                      </div>
                      <button onClick={() => deleteReview(r._id)} className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {reviewPages > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                  {Array.from({ length: reviewPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setReviewPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${reviewPage === p ? 'bg-[#006b2c] text-white' : 'bg-white text-slate-500 hover:bg-[#f3f4f5]'}`}>{p}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════ COURSES ══════ */}
          {tab === 'courses' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input value={courseSearch} onChange={e => setCourseSearch(e.target.value)}
                    placeholder="ค้นหาวิชา..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e1e3e4] rounded-xl text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
                </div>
                <button onClick={() => { setCourseForm('new'); setCourseFormData({ code: '', name: '', category: CATEGORIES[0], description: '', credits: 3 }) }}
                  className="flex items-center gap-2 bg-[#006b2c] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#00873a] transition-all">
                  <span className="material-symbols-outlined text-base">add</span>เพิ่มวิชาใหม่
                </button>
              </div>

              {/* Add/Edit form */}
              {courseForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#006b2c]/20">
                  <h3 className="font-bold text-[#191c1d] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#006b2c]">{courseForm === 'new' ? 'add_circle' : 'edit'}</span>
                    {courseForm === 'new' ? 'เพิ่มวิชาใหม่' : `แก้ไข: ${courseForm.code}`}
                  </h3>
                  <form onSubmit={saveCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3e4a3d] mb-1">รหัสวิชา *</label>
                      <input required value={courseFormData.code} onChange={e => setCourseFormData(p => ({ ...p, code: e.target.value }))}
                        disabled={courseForm !== 'new'} placeholder="เช่น IST20 1005"
                        className="w-full bg-[#f3f4f5] disabled:opacity-60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3e4a3d] mb-1">หมวดหมู่ *</label>
                      <select required value={courseFormData.category} onChange={e => setCourseFormData(p => ({ ...p, category: e.target.value }))}
                        className="w-full bg-[#f3f4f5] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#3e4a3d] mb-1">ชื่อวิชา *</label>
                      <input required value={courseFormData.name} onChange={e => setCourseFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="ชื่อวิชาภาษาไทย"
                        className="w-full bg-[#f3f4f5] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#3e4a3d] mb-1">คำอธิบาย</label>
                      <textarea rows={2} value={courseFormData.description} onChange={e => setCourseFormData(p => ({ ...p, description: e.target.value }))}
                        className="w-full bg-[#f3f4f5] rounded-xl px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-[#006b2c] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3e4a3d] mb-1">หน่วยกิต</label>
                      <input type="number" min="1" max="6" value={courseFormData.credits} onChange={e => setCourseFormData(p => ({ ...p, credits: parseInt(e.target.value) }))}
                        className="w-full bg-[#f3f4f5] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#006b2c] outline-none" />
                    </div>
                    <div className="flex items-end gap-3">
                      <button type="submit" disabled={loading}
                        className="flex-1 bg-[#006b2c] text-white font-bold py-2.5 rounded-xl hover:bg-[#00873a] disabled:opacity-50 transition-all text-sm">
                        {loading ? 'กำลังบันทึก…' : courseForm === 'new' ? 'เพิ่มวิชา' : 'บันทึก'}
                      </button>
                      <button type="button" onClick={() => setCourseForm(null)}
                        className="flex-1 border border-[#e1e3e4] text-slate-500 font-bold py-2.5 rounded-xl hover:bg-[#f3f4f5] text-sm">ยกเลิก</button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredCourses.map(c => (
                    <div key={c._id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-bold text-sm text-[#006b2c]">{c.code}</span>
                          <span className="text-xs bg-[#f3f4f5] text-slate-500 px-2 py-0.5 rounded-full">{c.category}</span>
                          <span className="text-xs text-slate-400">{c.credits} หน่วยกิต · {c.totalReviews || 0} รีวิว</span>
                        </div>
                        <p className="text-sm text-[#191c1d] truncate">{c.name}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => { setCourseForm(c); setCourseFormData({ code: c.code, name: c.name, category: c.category, description: c.description || '', credits: c.credits || 3 }) }}
                          className="w-9 h-9 flex items-center justify-center bg-[#f3f4f5] text-slate-600 rounded-xl hover:bg-[#006b2c] hover:text-white transition-all">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => deleteCourse(c._id)}
                          className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════ CONTACTS ══════ */}
          {tab === 'contacts' && (
            <div className="space-y-4 max-w-4xl">
              <p className="text-sm text-[#6e7b6c]">{loading ? 'กำลังโหลด…' : `${contacts.length} ข้อความ`}</p>
              {loading ? <LoadingSpinner /> : contacts.length === 0 ? <EmptyState icon="mail" label="ไม่มีข้อความ" /> : contacts.map(c => (
                <div key={c._id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-bold text-sm text-[#191c1d]">{c.name}</p>
                      <p className="text-xs text-[#6e7b6c]">{c.email} · {c.createdAt ? new Date(c.createdAt).toLocaleString('th-TH') : ''}</p>
                    </div>
                    <span className="bg-[#baecbc]/50 text-[#006b2c] text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">{c.subject}</span>
                  </div>
                  <p className="text-sm text-[#3e4a3d] leading-relaxed bg-[#f3f4f5] rounded-xl px-4 py-3">
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── tiny sub-components ─────────────────────── */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="material-symbols-outlined text-4xl text-[#bdcaba] animate-spin">refresh</span>
    </div>
  )
}
function EmptyState({ icon, label }) {
  return (
    <div className="bg-white rounded-2xl p-16 text-center shadow-sm text-slate-400">
      <span className="material-symbols-outlined text-5xl block mb-3">{icon}</span>
      <p className="font-medium">{label}</p>
    </div>
  )
}
