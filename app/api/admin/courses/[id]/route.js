import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Review from '@/models/Review'

// PATCH /api/admin/courses/[id] — update course
export async function PATCH(req, { params }) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  await connectDB()
  const body = await req.json()
  const updated = await Course.findByIdAndUpdate(id, body, { new: true })
  if (!updated) return Response.json({ error: 'Course not found' }, { status: 404 })
  return Response.json({ ...updated.toObject(), _id: updated._id.toString() })
}

// DELETE /api/admin/courses/[id] — delete course and all its reviews
export async function DELETE(req, { params }) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  await connectDB()
  const course = await Course.findById(id)
  if (!course) return Response.json({ error: 'Not found' }, { status: 404 })
  await Review.deleteMany({ courseCode: course.code })
  await Course.findByIdAndDelete(id)
  return Response.json({ success: true })
}
