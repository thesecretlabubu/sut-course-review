import Link from 'next/link'
import StarRating from './StarRating'

const categoryColors = {
  'วิทยาศาสตร์และเทคโนโลยี': 'bg-green-100 text-green-700',
  'มนุษยศาสตร์': 'bg-purple-100 text-purple-700',
  'สังคมศาสตร์': 'bg-blue-100 text-blue-700',
  'ภาษา': 'bg-indigo-100 text-indigo-700',
}

export default function CourseCard({ course }) {
  const tagColor = categoryColors[course.category] || 'bg-slate-100 text-slate-600'

  return (
    <article className="bg-white p-6 rounded-xl hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group flex flex-col justify-between border border-transparent hover:border-[#006b2c]/10 min-h-[220px]">
      <div>
        {/* Top row */}
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${tagColor}`}>
            {course.category}
          </span>
          <div className="flex items-center gap-1 bg-[#e7e8e9] px-2 py-1 rounded-lg">
            <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-xs font-bold text-[#191c1d]">{(course.avgRating || 0).toFixed(1)}</span>
          </div>
        </div>

        {/* Course info */}
        <h2 className="text-xl font-bold text-[#191c1d] mb-1 group-hover:text-[#006b2c] transition-colors" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
          {course.code}
        </h2>
        <p className="text-[#3e4a3d] leading-relaxed mb-2 text-sm">{course.name}</p>
        {course.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">{course.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-slate-400 text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">forum</span>
          {course.totalReviews || 0} รีวิว
        </p>
        <Link
          href={`/courses/${course._id}`}
          className="flex items-center gap-1 text-sm font-semibold text-[#006b2c] hover:text-[#00873a] group-hover:underline transition-colors"
        >
          ดูรีวิว <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </article>
  )
}
