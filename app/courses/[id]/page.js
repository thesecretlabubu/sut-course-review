export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Review from '@/models/Review'
import StarRating from '@/app/components/StarRating'
import UpvoteButton from '@/app/components/UpvoteButton'
import ReportButton from '@/app/components/ReportButton'
import { auth } from '@/lib/auth'

async function getData(id) {
  noStore()   // always fetch fresh after review submissions
  await connectDB()
  const course = await Course.findById(id).lean()
  if (!course) return null
  const reviews = await Review.find({ courseCode: course.code })
    .sort({ createdAt: -1 })
    .lean()
  return {
    course: { ...course, _id: course._id.toString() },
    reviews: reviews.map(r => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    })),
  }
}

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชม. ที่แล้ว`
  return `${Math.floor(diff / 86400)} วันที่แล้ว`
}

const gradeColors = {
  A: 'bg-green-100 text-green-700',
  'B+': 'bg-emerald-100 text-emerald-700',
  B: 'bg-teal-100 text-teal-700',
  'C+': 'bg-yellow-100 text-yellow-700',
  C: 'bg-orange-100 text-orange-700',
  'D+': 'bg-red-100 text-red-600',
  D: 'bg-red-100 text-red-600',
  F: 'bg-red-200 text-red-700',
}

export default async function CourseDetail({ params }) {
  // Next.js 16: params is a Promise — must await
  const { id } = await params
  const session = await auth()
  const data = await getData(id)

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#f3f4f5]">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-slate-300 block mb-4">school</span>
          <h1 className="text-2xl font-bold text-[#191c1d] mb-2">ไม่พบวิชา</h1>
          <p className="text-slate-400 text-sm mb-6">กรุณาตรวจสอบลิงก์อีกครั้ง</p>
          <Link href="/courses" className="bg-[#006b2c] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#00873a] transition-all text-sm">
            กลับไปหน้ารายวิชา
          </Link>
        </div>
      </div>
    )
  }

  const { course, reviews } = data
  const count = reviews.length

  // Averages
  const avgFun = count > 0 ? reviews.reduce((s, r) => s + (r.ratingFun || 0), 0) / count : 0
  const avgWorkload = count > 0 ? reviews.reduce((s, r) => s + (r.ratingWorkload || 0), 0) / count : 0
  const avgDifficulty = count > 0 ? reviews.reduce((s, r) => s + (r.ratingDifficulty || 0), 0) / count : 0

  // Grade distribution
  const grades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F']
  const dist = {}
  grades.forEach(g => { dist[g] = 0 })
  reviews.forEach(r => { if (r.gradeReceived && dist[r.gradeReceived] !== undefined) dist[r.gradeReceived]++ })
  const maxDist = Math.max(...Object.values(dist), 1)

  return (
    <div className="min-h-screen bg-[#f3f4f5] pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6e7b6c] mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#006b2c] transition-colors">หน้าแรก</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/courses" className="hover:text-[#006b2c] transition-colors">วิชาทั้งหมด</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-semibold text-[#191c1d]">{course.code}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main column */}
          <article className="lg:col-span-8 space-y-6">

            {/* ── Course Header Card ── */}
            <section className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="bg-[#baecbc] text-[#006b2c] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.category || 'ทั่วไป'}
                    </span>
                    {course.credits && (
                      <span className="bg-[#e7e8e9] text-[#3e4a3d] text-xs font-bold px-3 py-1 rounded-full">
                        {course.credits} หน่วยกิต
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1d]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                    {course.code} · {course.name}
                  </h1>
                  {course.description && (
                    <p className="text-[#3e4a3d] mt-2 text-sm leading-relaxed">{course.description}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-5xl font-extrabold text-[#006b2c]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {avgFun > 0 ? avgFun.toFixed(1) : '—'}
                  </div>
                  <StarRating rating={avgFun} size="md" />
                  <p className="text-xs text-[#6e7b6c] mt-1">จาก {count} รีวิว</p>
                </div>
              </div>

              {/* Sub-score bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { label: '⭐ ความสนุก', val: avgFun },
                  { label: '📚 ปริมาณงาน', val: avgWorkload },
                  { label: '🧠 ความยาก', val: avgDifficulty },
                ].map(({ label, val }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-[#3e4a3d]">{label}</span>
                      <span className="text-[#006b2c] font-bold">{val > 0 ? val.toFixed(1) : '—'}</span>
                    </div>
                    <div className="h-2 bg-[#edeeef] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#006b2c] rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, val * 20)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Grade Distribution ── */}
            <section className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-[#191c1d] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                <span className="material-symbols-outlined text-[#006b2c]">analytics</span>
                การกระจายเกรด
              </h2>
              {count > 0 ? (
                <div className="px-2">
                  {/* Bars */}
                  <div className="flex items-end gap-2" style={{ height: '160px' }}>
                    {grades.map(g => {
                      const val = dist[g]
                      const barH = val > 0 ? Math.max(12, Math.round((val / maxDist) * 160)) : 4
                      return (
                        <div key={g} className="flex-1 flex flex-col items-center justify-end h-full group/bar">
                          <span className="text-xs font-bold text-[#006b2c] mb-1 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {val > 0 ? val : ''}
                          </span>
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              val > 0
                                ? 'bg-[#006b2c]/40 group-hover/bar:bg-[#006b2c]'
                                : 'bg-[#edeeef]'
                            }`}
                            style={{ height: `${barH}px` }}
                          />
                        </div>
                      )
                    })}
                  </div>
                  {/* Grade labels */}
                  <div className="flex gap-2 mt-2">
                    {grades.map(g => (
                      <div key={g} className="flex-1 text-center">
                        <span className="text-xs font-bold text-[#3e4a3d]">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-[#6e7b6c] text-sm py-8">ยังไม่มีข้อมูลเกรด</p>
              )}
            </section>

            {/* ── Reviews ── */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#191c1d]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                บทวิจารณ์จากนักศึกษา ({count})
              </h2>

              {reviews.length > 0 ? reviews.map(review => (
                <article key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-transparent hover:border-[#bdcaba] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#baecbc] flex items-center justify-center text-[#006b2c] flex-shrink-0">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#191c1d]">
                          {review.isAnonymous ? 'นักศึกษา (ไม่ระบุชื่อ)' : (review.userName || 'นักศึกษา')}
                        </h4>
                        <p className="text-xs text-[#6e7b6c]">
                          เทอม {review.semester || '—'} · {review.createdAt ? timeAgo(review.createdAt) : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StarRating rating={review.ratingFun || 0} size="sm" />
                      {review.gradeReceived && (
                        <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${gradeColors[review.gradeReceived] || 'bg-[#edeeef] text-[#3e4a3d]'}`}>
                          เกรด {review.gradeReceived}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mini sub-scores */}
                  <div className="flex gap-4 mb-3 text-xs text-[#6e7b6c]">
                    <span>สนุก: <strong className="text-[#006b2c]">{review.ratingFun || '?'}</strong></span>
                    <span>งาน: <strong className="text-[#006b2c]">{review.ratingWorkload || '?'}</strong></span>
                    <span>ยาก: <strong className="text-[#006b2c]">{review.ratingDifficulty || '?'}</strong></span>
                  </div>

                  <p className="text-sm leading-relaxed text-[#191c1d] mb-4">
                    {review.comment || 'ไม่มีความคิดเห็นเพิ่มเติม'}
                  </p>

                  <div className="flex items-center justify-between border-t border-[#edeeef] pt-3">
                    <UpvoteButton reviewId={review._id} initialUpvotes={review.upvotes || 0} />
                    <ReportButton reviewId={review._id} courseCode={review.courseCode} />
                  </div>
                </article>
              )) : (
                <div className="bg-white rounded-xl p-12 text-center text-[#6e7b6c] shadow-sm">
                  <span className="material-symbols-outlined text-4xl block mb-3">rate_review</span>
                  <p>ยังไม่มีรีวิวสำหรับวิชานี้ เป็นคนแรกที่รีวิว!</p>
                </div>
              )}
            </section>

            {/* ── Write Review CTA ── */}
            <section
              className="p-10 rounded-xl text-center shadow-xl relative overflow-hidden group/cta"
              style={{ background: 'linear-gradient(135deg, #006b2c 0%, #00873a 100%)' }}
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover/cta:scale-110 transition-transform duration-700" />
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
              <h3 className="text-2xl font-extrabold text-white mb-3 relative z-10" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                เคยเรียนวิชานี้แล้วใช่ไหม?
              </h3>
              <p className="text-green-100 mb-8 relative z-10 max-w-lg mx-auto text-sm">
                แบ่งปันประสบการณ์การเรียนของคุณเพื่อช่วยให้เพื่อนๆ ตัดสินใจได้ดียิ่งขึ้น
              </p>
              {session ? (
                <Link
                  href={`/courses/${id}/write-review`}
                  className="relative z-10 inline-flex items-center gap-2 bg-white text-[#006b2c] hover:bg-green-50 font-bold px-10 py-3 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  เขียนรีวิว <span className="material-symbols-outlined">edit_square</span>
                </Link>
              ) : (
                <Link
                  href="/api/auth/signin"
                  className="relative z-10 inline-flex items-center gap-2 bg-white text-[#006b2c] hover:bg-green-50 font-bold px-10 py-3 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Login เพื่อเขียนรีวิว <span className="material-symbols-outlined">login</span>
                </Link>
              )}
            </section>

          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h3 className="font-bold text-[#191c1d] mb-4" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                ข้อมูลวิชา
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-[#6e7b6c]">รหัสวิชา</span>
                  <span className="font-bold text-[#191c1d]">{course.code}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#6e7b6c]">หน่วยกิต</span>
                  <span className="font-bold text-[#191c1d]">{course.credits || 3} หน่วยกิต</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#6e7b6c]">หมวดหมู่</span>
                  <span className="font-bold text-[#191c1d] text-right max-w-[60%]">{course.category}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#6e7b6c]">จำนวนรีวิว</span>
                  <span className="font-bold text-[#191c1d]">{count} รีวิว</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-[#edeeef]">
                {session ? (
                  <Link
                    href={`/courses/${id}/write-review`}
                    className="w-full flex items-center justify-center gap-2 bg-[#006b2c] text-white py-3 rounded-xl font-bold hover:bg-[#00873a] transition-all text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">edit_square</span>
                    เขียนรีวิว
                  </Link>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#006b2c] text-[#006b2c] py-3 rounded-xl font-bold hover:bg-[#006b2c] hover:text-white transition-all text-sm"
                  >
                    Login เพื่อรีวิว
                  </Link>
                )}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
