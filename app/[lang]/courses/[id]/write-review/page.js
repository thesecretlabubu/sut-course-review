import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Review from '@/models/Review'
import WriteReviewForm from '@/app/components/WriteReviewForm'
import DeleteReviewButton from '@/app/components/DeleteReviewButton'
import { getDictionary } from '@/lib/i18n'

async function getCourse(id) {
  await connectDB()
  const course = await Course.findById(id).lean()
  if (!course) return null
  return { ...course, _id: course._id.toString() }
}

export default async function WriteReviewPage({ params }) {
  const { id, lang } = await params
  const dict = await getDictionary(lang)
  const session = await auth()

  // Must be logged in
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/${lang}/courses/${id}/write-review`)
  }

  const course = await getCourse(id)
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f5] p-8">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <h1 className="text-xl font-bold mb-4">{dict.writeReviewPage.notFound}</h1>
          <Link href={`/${lang}/courses`} className="text-[#006b2c] hover:underline text-sm">
            {dict.writeReviewPage.backToCourses}
          </Link>
        </div>
      </div>
    )
  }

  // Check if already reviewed
  const userId = session.user.id || session.user.email
  await connectDB()
  const existing = await Review.findOne({ courseCode: course.code, userId }).lean()

  const t = dict.writeReviewPage

  return (
    <div className="min-h-screen bg-[#f3f4f5]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6e7b6c] mb-6 flex-wrap">
          <Link href={`/${lang}/courses`} className="hover:text-[#006b2c] transition-colors">{t.allCourses}</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href={`/${lang}/courses/${id}`} className="hover:text-[#006b2c] transition-colors">{course.code}</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-semibold text-[#006b2c]">{t.writeReview}</span>
        </nav>

        {/* Header */}
        <header className="mb-8 md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1d]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            {t.writeReview}: <span className="text-[#006b2c]">{course.code}</span>
          </h1>
          <p className="text-[#3e4a3d] mt-2">{course.name}</p>
        </header>

        {/* Already reviewed? */}
        {existing ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-3xl text-yellow-500 flex-shrink-0">info</span>
                <div className="flex-1">
                  <h2 className="font-bold text-[#191c1d] mb-1">{t.alreadyReviewed}</h2>
                  <p className="text-sm text-slate-500 mb-3">
                    {t.semesterLabel} {existing.semester} · {t.gradeLabel} {existing.gradeReceived}
                    {existing.comment && ` · "${existing.comment.slice(0, 60)}${existing.comment.length > 60 ? '...' : ''}"`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/${lang}/courses/${id}`}
                      className="bg-[#006b2c] text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-[#00873a] transition-all inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      {t.viewCourse}
                    </Link>
                    <DeleteReviewButton courseCode={course.code} courseId={id} lang={lang} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Form */}
            <WriteReviewForm
              courseId={id}
              courseCode={course.code}
              courseName={course.name}
              lang={lang}
            />

            {/* Tips */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#baecbc]/30 p-6 rounded-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-[#3b6842]">
                  <span className="material-symbols-outlined">lightbulb</span> {t.tips}
                </h3>
                <ul className="text-sm space-y-2 text-[#406c46] list-disc list-inside">
                  <li>{t.tip1}</li>
                  <li>{t.tip2}</li>
                  <li>{t.tip3}</li>
                  <li>{t.tip4}</li>
                </ul>
              </div>
              <div className="bg-[#ffd9de]/20 p-6 rounded-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-[#a72d51]">
                  <span className="material-symbols-outlined">gavel</span> {t.warning}
                </h3>
                <p className="text-sm text-[#3e4a3d] leading-relaxed">
                  {t.warningDesc}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
