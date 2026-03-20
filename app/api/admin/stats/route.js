import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Review from '@/models/Review'
import Report from '@/models/Report'
import Contact from '@/models/Contact'

// GET /api/admin/stats
export async function GET(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  await connectDB()
  const [totalCourses, totalReviews, pendingReports, totalContacts] = await Promise.all([
    Course.countDocuments(),
    Review.countDocuments(),
    Report.countDocuments({ resolved: false }),
    Contact.countDocuments(),
  ])
  return Response.json({ totalCourses, totalReviews, pendingReports, totalContacts })
}
