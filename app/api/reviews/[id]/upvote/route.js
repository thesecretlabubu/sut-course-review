import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import { auth } from '@/lib/auth'

// PATCH /api/reviews/[id]/upvote
export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: 'Please login to upvote' }, { status: 401 })
  }

  try {
    await connectDB()
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const action = body.action === 'remove' ? -1 : 1

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { upvotes: action } },
      { new: true }
    )
    if (!review) return Response.json({ error: 'Review not found' }, { status: 404 })

    // Prevent upvotes from going below 0
    if (review.upvotes < 0) {
      await Review.findByIdAndUpdate(id, { $set: { upvotes: 0 } })
      return Response.json({ upvotes: 0 })
    }

    return Response.json({ upvotes: review.upvotes })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
