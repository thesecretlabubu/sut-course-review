import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'

export async function GET(request) {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set')
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')
    const q = searchParams.get('q')

    const filter = {}
    if (category) filter.category = category
    if (q) filter.$or = [
      { code: { $regex: q, $options: 'i' } },
      { name: { $regex: q, $options: 'i' } },
    ]

    let sortQuery = { avgRating: -1 }
    if (sort === 'reviews') sortQuery = { totalReviews: -1 }
    else if (sort === 'name') sortQuery = { code: 1 }

    const courses = await Course.find(filter).sort(sortQuery).lean()
    return Response.json(courses)
  } catch (error) {
    console.error('GET /api/courses failed:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set')
    await connectDB()
    const body = await req.json()
    const course = await Course.create(body)
    return Response.json(course)
  } catch (error) {
    console.error('POST /api/courses failed:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
