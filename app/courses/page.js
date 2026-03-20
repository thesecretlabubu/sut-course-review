import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import CourseCard from '@/app/components/CourseCard'

const CATEGORIES = ['วิทยาศาสตร์และเทคโนโลยี', 'มนุษยศาสตร์', 'สังคมศาสตร์', 'ภาษา']
const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating สูงสุด' },
  { value: 'reviews', label: 'รีวิวมากที่สุด' },
  { value: 'name', label: 'ตัวอักษร A-Z' },
]

async function getCourses({ category, sort, q }) {
  await connectDB()
  const filter = {}
  if (category) filter.category = category
  if (q) filter.$or = [
    { code: { $regex: q, $options: 'i' } },
    { name: { $regex: q, $options: 'i' } },
  ]

  let sortQuery = {}
  if (sort === 'rating') sortQuery = { avgRating: -1 }
  else if (sort === 'reviews') sortQuery = { totalReviews: -1 }
  else if (sort === 'name') sortQuery = { code: 1 }
  else sortQuery = { avgRating: -1 }

  const courses = await Course.find(filter).sort(sortQuery).lean()
  return courses.map(c => ({ ...c, _id: c._id.toString() }))
}

export default async function CoursesPage({ searchParams }) {
  const params = await searchParams
  const category = params.category || ''
  const sort = params.sort || 'rating'
  const q = params.q || ''

  const courses = await getCourses({ category, sort, q })

  return (
    <div className="flex min-h-screen bg-[#f3f4f5]">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col gap-1 w-64 shrink-0 p-6 bg-white border-r border-[#e1e3e4] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-6">
          <h2 className="font-bold text-[#191c1d] text-lg" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>หมวดหมู่</h2>
          <p className="text-xs text-[#6e7b6c]">กรองตามคณะ/วิชา</p>
        </div>

        {/* All */}
        <Link
          href="/courses"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-sm transition-all hover:translate-x-1 ${!category ? 'bg-[#f3f4f5] text-[#006b2c]' : 'text-slate-500 hover:bg-[#f3f4f5]'}`}
          style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}
        >
          <span className="material-symbols-outlined">grid_view</span> ทั้งหมด
        </Link>
        {[
          { val: 'วิทยาศาสตร์และเทคโนโลยี', icon: 'science' },
          { val: 'มนุษยศาสตร์', icon: 'auto_stories' },
          { val: 'สังคมศาสตร์', icon: 'groups' },
          { val: 'ภาษา', icon: 'translate' },
        ].map(({ val, icon }) => {
          const params = new URLSearchParams({ category: val, sort })
          return (
            <Link
              key={val}
              href={`/courses?${params}`}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all hover:translate-x-1 ${category === val ? 'bg-[#f3f4f5] text-[#006b2c] font-bold' : 'text-slate-500 hover:bg-[#f3f4f5]'}`}
              style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}
            >
              <span className="material-symbols-outlined">{icon}</span> {val}
            </Link>
          )
        })}

        {/* Sort */}
        <div className="mt-8 pt-6 border-t border-[#e1e3e4]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6e7b6c] mb-3">เรียงตาม</h3>
          <div className="flex flex-col gap-2">
            {SORT_OPTIONS.map(opt => {
              const p = new URLSearchParams()
              if (category) p.set('category', category)
              p.set('sort', opt.value)
              if (q) p.set('q', q)
              return (
                <Link
                  key={opt.value}
                  href={`/courses?${p}`}
                  className={`text-sm px-3 py-2 rounded-lg transition-colors ${sort === opt.value ? 'bg-[#006b2c] text-white font-bold' : 'text-slate-500 hover:bg-[#f3f4f5]'}`}
                >
                  {opt.label}
                </Link>
              )
            })}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-6 md:p-8">
        {/* Search + Header */}
        <div className="mb-8 space-y-4">
          <form method="GET" action="/courses" className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="ค้นหารหัสวิชา หรือ ชื่อวิชา..."
              className="w-full bg-white border border-[#e1e3e4] focus:ring-2 focus:ring-[#006b2c] rounded-xl py-4 pl-12 pr-4 shadow-sm text-sm md:text-base outline-none transition-all"
            />
            {/* pass through hidden fields */}
            {category && <input type="hidden" name="category" value={category} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
          </form>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1d]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                {category || 'คอร์สทั้งหมด'}
              </h1>
              <p className="text-[#6e7b6c] mt-1 text-sm">
                {q ? `ผลการค้นหา "${q}" — ` : ''}
                แสดง {courses.length} รายการ
              </p>
            </div>

            {/* Mobile category pills */}
            <div className="flex lg:hidden gap-2 flex-wrap">
              {CATEGORIES.map(cat => {
                const p = new URLSearchParams({ category: cat, sort })
                return (
                  <Link
                    key={cat}
                    href={`/courses?${p}`}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${category === cat ? 'bg-[#006b2c] text-white' : 'bg-white border border-[#e1e3e4] text-slate-500'}`}
                  >
                    {cat.split('และ')[0]}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-16 text-center text-slate-400 shadow-sm">
            <span className="material-symbols-outlined text-5xl block mb-4">search_off</span>
            <p className="font-medium">ไม่พบวิชาที่ค้นหา</p>
            <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
            <Link href="/courses" className="inline-block mt-4 text-[#006b2c] font-medium text-sm hover:underline">
              ดูวิชาทั้งหมด
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
