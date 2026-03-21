export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import CourseCard from '@/app/components/CourseCard'
import MobileFilterDrawer from '@/app/components/MobileFilterDrawer'
import { getDictionary } from '@/lib/i18n'

const CATEGORIES = [
  { th: 'วิทยาศาสตร์และเทคโนโลยี', en: 'Science & Technology', zh: '科学与技术', icon: 'science' },
  { th: 'มนุษยศาสตร์', en: 'Humanities', zh: '人文科学', icon: 'auto_stories' },
  { th: 'สังคมศาสตร์', en: 'Social Sciences', zh: '社会科学', icon: 'groups' },
  { th: 'ภาษา', en: 'Languages', zh: '语言', icon: 'translate' },
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

export default async function CoursesPage({ params, searchParams }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const sParams = await searchParams
  const category = sParams.category || ''
  const sort = sParams.sort || 'rating'
  const q = sParams.q || ''

  const courses = await getCourses({ category, sort, q })

  const t = {
    th: {
      category: 'หมวดหมู่',
      filterBy: 'กรองตามคณะ/วิชา',
      all: 'ทั้งหมด',
      sortBy: 'เรียงตาม',
      searchPlaceholder: 'ค้นหารหัสวิชา หรือ ชื่อวิชา...',
      resultsFor: 'ผลการค้นหา',
      showing: 'แสดง',
      items: 'รายการ',
      noCourses: 'ไม่พบวิชาที่ค้นหา',
      tryChange: 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่',
      viewAll: 'ดูวิชาทั้งหมด',
      sortOptions: [
        { value: 'rating', label: 'Rating สูงสุด' },
        { value: 'reviews', label: 'รีวิวมากที่สุด' },
        { value: 'name', label: 'ตัวอักษร A-Z' },
      ]
    },
    en: {
      category: 'Category',
      filterBy: 'Filter by area',
      all: 'All',
      sortBy: 'Sort by',
      searchPlaceholder: 'Search course code or name...',
      resultsFor: 'Results for',
      showing: 'Showing',
      items: 'items',
      noCourses: 'No courses found',
      tryChange: 'Try changing search term or category',
      viewAll: 'View all courses',
      sortOptions: [
        { value: 'rating', label: 'Highest Rating' },
        { value: 'reviews', label: 'Most Reviews' },
        { value: 'name', label: 'Alphabetical A-Z' },
      ]
    },
    zh: {
      category: '类别',
      filterBy: '按领域筛选',
      all: '全部',
      sortBy: '排序方式',
      searchPlaceholder: '搜索课程代码或名称...',
      resultsFor: '搜索结果',
      showing: '显示',
      items: '项',
      noCourses: '未找到课程',
      tryChange: '尝试更改搜索词或类别',
      viewAll: '查看所有课程',
      sortOptions: [
        { value: 'rating', label: '最高评分' },
        { value: 'reviews', label: '最多评论' },
        { value: 'name', label: '按字母 A-Z' },
      ]
    }
  }[lang]

  return (
    <div className="flex min-h-screen bg-[#f3f4f5]">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col gap-1 w-64 shrink-0 p-6 bg-white border-r border-[#e1e3e4] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-6">
          <h2 className="font-bold text-[#191c1d] text-lg" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>{t.category}</h2>
          <p className="text-xs text-[#6e7b6c]">{t.filterBy}</p>
        </div>

        {/* All */}
        <Link
          href={`/${lang}/courses`}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-sm transition-all hover:translate-x-1 ${!category ? 'bg-[#f3f4f5] text-[#006b2c]' : 'text-slate-500 hover:bg-[#f3f4f5]'}`}
          style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}
        >
          <span className="material-symbols-outlined">grid_view</span> {t.all}
        </Link>
        {CATEGORIES.map((cat) => {
          const params = new URLSearchParams({ category: cat.th, sort })
          if (q) params.set('q', q)
          return (
            <Link
              key={cat.th}
              href={`/${lang}/courses?${params}`}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all hover:translate-x-1 ${category === cat.th ? 'bg-[#f3f4f5] text-[#006b2c] font-bold' : 'text-slate-500 hover:bg-[#f3f4f5]'}`}
              style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}
            >
              <span className="material-symbols-outlined">{cat.icon}</span> {cat[lang] || cat.en}
            </Link>
          )
        })}

        {/* Sort */}
        <div className="mt-8 pt-6 border-t border-[#e1e3e4]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6e7b6c] mb-3">{t.sortBy}</h3>
          <div className="flex flex-col gap-2">
            {t.sortOptions.map(opt => {
              const p = new URLSearchParams()
              if (category) p.set('category', category)
              p.set('sort', opt.value)
              if (q) p.set('q', q)
              return (
                <Link
                  key={opt.value}
                  href={`/${lang}/courses?${p}`}
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
      <main className="flex-1 min-w-0 p-4 md:p-8">
        {/* Search + Header */}
        <div className="mb-8 space-y-4">
          {/* Desktop Search */}
          <div className="hidden md:block">
            <form method="GET" action={`/${lang}/courses`} className="relative group max-w-2xl">
              <span className="material-symbols-outlined absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
              <input
                name="q"
                type="text"
                defaultValue={q}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 sm:pl-14 pr-16 sm:pr-36 py-4 sm:py-5 bg-white rounded-xl shadow-sm border border-[#e1e3e4] focus:ring-2 focus:ring-[#006b2c] outline-none text-base sm:text-lg"
              />
              {category && <input type="hidden" name="category" value={category} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[#006b2c] text-white px-8 rounded-lg font-bold hover:bg-[#00873a] transition-all flex items-center justify-center"
              >
                <span>{t.searchPlaceholder.split(" ")[0]}</span>
              </button>
            </form>
          </div>

          {/* Mobile Search & Filter Drawer */}
          <MobileFilterDrawer 
            lang={lang} 
            t={t} 
            CATEGORIES={CATEGORIES} 
            initialQ={q} 
            initialCategory={category} 
            initialSort={sort} 
          />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1d]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                {CATEGORIES.find(c => c.th === category)?.[lang] || category || t.all}
              </h1>
              <p className="text-[#6e7b6c] mt-1 text-sm">
                {q ? `${t.resultsFor} "${q}" — ` : ''}
                {t.showing} {courses.length} {t.items}
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-16 text-center text-slate-400 shadow-sm">
            <span className="material-symbols-outlined text-5xl block mb-4">search_off</span>
            <p className="font-medium">{t.noCourses}</p>
            <p className="text-sm mt-1">{t.tryChange}</p>
            <Link href={`/${lang}/courses`} className="inline-block mt-4 text-[#006b2c] font-medium text-sm hover:underline">
              {t.viewAll}
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
