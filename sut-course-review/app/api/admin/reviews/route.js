import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Course from '@/models/Course'

// GET /api/admin/reviews?courseCode=...&page=1
export async function GET(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const courseCode = searchParams.get('courseCode') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20

  await connectDB()
  const filter = courseCode ? { courseCode: { $regex: courseCode, $options: 'i' } } : {}
  const [reviews, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Review.countDocuments(filter),
  ])
  return Response.json({
    reviews: reviews.map(r => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt?.toISOString() || null,
    })),
    total,
    pages: Math.ceil(total / limit),
  })
}

// DELETE /api/admin/reviews?reviewId=...
export async function DELETE(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const reviewId = searchParams.get('reviewId')
  await connectDB()
  const review = await Review.findByIdAndDelete(reviewId)
  if (!review) return Response.json({ error: 'Not found' }, { status: 404 })

  // Recalculate avgRating
  const remaining = await Review.find({ courseCode: review.courseCode })
  const total = remaining.length
  const avgRating = total > 0
    ? remaining.reduce((s, r) => s + ((r.ratingFun || 0) + (r.ratingWorkload || 0) + (r.ratingDifficulty || 0)) / 3, 0) / total
    : 0
  await Course.findOneAndUpdate({ code: review.courseCode }, {
    totalReviews: total,
    avgRating: Math.round(avgRating * 10) / 10,
  })
  return Response.json({ success: true })
}
