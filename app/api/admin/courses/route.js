import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'

// GET /api/admin/courses — list all
export async function GET(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  await connectDB()
  const courses = await Course.find().sort({ code: 1 }).lean()
  return Response.json(courses.map(c => ({ ...c, _id: c._id.toString() })))
}

// POST /api/admin/courses — create new course
export async function POST(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  await connectDB()
  const body = await req.json()
  const { code, name, category, description, credits } = body
  if (!code || !name || !category) {
    return Response.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, { status: 400 })
  }
  const existing = await Course.findOne({ code })
  if (existing) {
    return Response.json({ error: 'รหัสวิชานี้มีอยู่แล้ว' }, { status: 409 })
  }
  const course = await Course.create({ code, name, category, description, credits: credits || 3 })
  return Response.json({ ...course.toObject(), _id: course._id.toString() }, { status: 201 })
}
