import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { connectDB } from '@/lib/mongodb'
import Report from '@/models/Report'
import Review from '@/models/Review'
import Course from '@/models/Course'

// POST /api/admin/delete-review?reportId=...&reviewId=...
export async function POST(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const reportId = searchParams.get('reportId')
  const reviewId = searchParams.get('reviewId')

  await connectDB()

  // Get review to find courseCode
  const review = await Review.findById(reviewId)
  if (review) {
    const courseCode = review.courseCode
    await Review.findByIdAndDelete(reviewId)

    // Recalculate avgRating
    const remaining = await Review.find({ courseCode })
    const total = remaining.length
    const avgRating = total > 0
      ? remaining.reduce((s, r) => s + ((r.ratingFun || 0) + (r.ratingWorkload || 0) + (r.ratingDifficulty || 0)) / 3, 0) / total
      : 0

    await Course.findOneAndUpdate({ code: courseCode }, {
      totalReviews: total,
      avgRating: Math.round(avgRating * 10) / 10,
    })
  }

  // Mark report as resolved
  if (reportId) await Report.findByIdAndUpdate(reportId, { resolved: true })

  return Response.redirect(new URL('/admin', req.url))
}
