import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Course from '@/models/Course'

// DELETE /api/reviews/my?courseCode=IST30+1101
// ลบรีวิวของตัวเองสำหรับวิชานั้น (เพื่อให้เขียนใหม่ได้)
export async function DELETE(req) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'กรุณา login ก่อน' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseCode = searchParams.get('courseCode')
    if (!courseCode) {
      return Response.json({ error: 'ต้องระบุ courseCode' }, { status: 400 })
    }

    const userId = session.user.id || session.user.email
    await connectDB()

    const deleted = await Review.findOneAndDelete({ courseCode, userId })
    if (!deleted) {
      return Response.json({ error: 'ไม่พบรีวิวของคุณสำหรับวิชานี้' }, { status: 404 })
    }

    // Recalculate avgRating
    const remaining = await Review.find({ courseCode })
    const totalReviews = remaining.length
    const avgFun = totalReviews > 0 ? remaining.reduce((s, r) => s + (r.ratingFun || 0), 0) / totalReviews : 0
    const avgWorkload = totalReviews > 0 ? remaining.reduce((s, r) => s + (r.ratingWorkload || 0), 0) / totalReviews : 0
    const avgDiff = totalReviews > 0 ? remaining.reduce((s, r) => s + (r.ratingDifficulty || 0), 0) / totalReviews : 0
    const avgRating = (avgFun + avgWorkload + avgDiff) / 3

    await Course.findOneAndUpdate({ code: courseCode }, {
      totalReviews,
      avgRating: totalReviews > 0 ? parseFloat(avgRating.toFixed(2)) : 0,
    })

    return Response.json({ success: true, message: 'ลบรีวิวแล้ว' })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
