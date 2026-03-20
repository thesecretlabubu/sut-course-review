import { connectDB } from '@/lib/mongodb'
import Report from '@/models/Report'
import Review from '@/models/Review'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'

// GET /api/reports?resolved=false — for admin dashboard
export async function GET(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await connectDB()
  const { searchParams } = new URL(req.url)
  const resolvedParam = searchParams.get('resolved')
  const filter = resolvedParam === 'false' ? { resolved: false } : {}
  const reports = await Report.find(filter).sort({ reportedAt: -1 }).lean()
  // Attach review data
  const withReviews = await Promise.all(
    reports.map(async rep => {
      const review = await Review.findById(rep.reviewId).lean()
      return {
        ...rep,
        _id: rep._id.toString(),
        reportedAt: rep.reportedAt?.toISOString() || null,
        review: review ? { ...review, _id: review._id.toString(), createdAt: review.createdAt?.toISOString() } : null,
      }
    })
  )
  return Response.json(withReviews)
}

// POST /api/reports — submit a new report
export async function POST(req) {
  try {
    await connectDB()
    const { reviewId, courseCode, reason, detail } = await req.json()
    if (!reviewId || !reason) {
      return Response.json({ error: 'ข้อมูลไม่ครบ' }, { status: 400 })
    }
    await Report.create({ reviewId, courseCode, reason, detail })
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
