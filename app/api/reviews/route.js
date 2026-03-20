import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const courseCode = searchParams.get('courseCode')

    const filter = courseCode ? { courseCode } : {}
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean()
    return Response.json(reviews)
  } catch (error) {
    console.error('GET /api/reviews failed:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
