export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Review from '@/models/Review'
import CourseCard from '@/app/components/CourseCard'
import StarRating from '@/app/components/StarRating'
import { getDictionary } from '@/lib/i18n'

async function getData() {
  await connectDB()
  const [topCourses, recentReviews] = await Promise.all([
    Course.find({ totalReviews: { $gte: 0 } })
      .sort({ avgRating: -1 })
      .limit(6)
      .lean(),
    Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ])
  return {
    topCourses: topCourses.map(c => ({ ...c, _id: c._id.toString() })),
    recentReviews: recentReviews.map(r => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    })),
  }
}

function timeAgo(date, dict) {
  const diff = (Date.now() - new Date(date)) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)} ${dict.common.minutesAgo}`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${dict.common.hoursAgo}`
  return `${Math.floor(diff / 86400)} ${dict.common.daysAgo}`
}

export default async function Home({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const { topCourses, recentReviews } = await getData()

  return (
    <div className="bg-[#f3f4f5]">
      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden py-24 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            {dict.common.homeTitle}
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-12">
            {dict.common.homeSubtitle}
          </p>
          <form action={`/${lang}/courses`} method="GET" className="relative max-w-2xl mx-auto group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
            <input
              name="q"
              type="text"
              placeholder={dict.common.searchPlaceholder}
              className="w-full pl-14 pr-36 py-5 bg-white rounded-xl shadow-2xl focus:ring-2 focus:ring-[#006b2c] outline-none text-lg placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-2 bottom-2 bg-[#006b2c] text-white px-8 rounded-lg font-bold hover:bg-[#00873a] transition-all"
            >
              {dict.common.search}
            </button>
          </form>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-20 pointer-events-none">
          <div className="w-96 h-96 rounded-full border-[40px] border-white/30" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 opacity-10 pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-white/40" />
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* Popular Courses */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              <span className="text-yellow-500"></span> {dict.common.popularCourses}
            </h2>
            <Link href={`/${lang}/courses?sort=rating`} className="text-[#006b2c] font-semibold hover:underline flex items-center gap-1 text-sm">
              {dict.common.viewAll} <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>

          {topCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {topCourses.map(course => (
                <CourseCard key={course._id} course={course} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-3">school</span>
              <p>{dict.common.noCourses}</p>
            </div>
          )}
        </section>

        {/* Recent Reviews */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              {dict.common.recentReviews}
            </h2>
          </div>

          {recentReviews.length > 0 ? (
            <div className="space-y-4">
              {recentReviews.map(review => (
                <article key={review._id} className="bg-white p-6 rounded-xl border-l-4 border-[#006b2c] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#baecbc] flex items-center justify-center text-[#006b2c] flex-shrink-0">
                        <span className="material-symbols-outlined text-sm">person</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#191c1d]">
                          {review.isAnonymous ? dict.common.anonymous : (review.userName || 'นักศึกษา')}
                        </p>
                        <p className="text-xs text-[#6e7b6c]">
                          รีวิววิชา {review.courseCode}
                          {review.createdAt && ` • ${timeAgo(review.createdAt, dict)}`}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.ratingFun || 0} size="sm" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{review.comment || 'ไม่มีความคิดเห็นเพิ่มเติม'}"
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-3">rate_review</span>
              <p>{dict.common.noReviews}</p>
            </div>
          )}
        </section>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <Link
          href={`/${lang}/courses`}
          className="bg-[#006b2c] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:pr-6 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 font-bold whitespace-nowrap text-sm">
            {dict.common.writeReview}
          </span>
        </Link>
      </div>
    </div>
  )
}
