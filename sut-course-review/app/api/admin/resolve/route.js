import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { connectDB } from '@/lib/mongodb'
import Report from '@/models/Report'

// POST /api/admin/resolve?reportId=...
export async function POST(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const reportId = searchParams.get('reportId')

  await connectDB()
  await Report.findByIdAndUpdate(reportId, { resolved: true })

  return Response.redirect(new URL('/admin', req.url))
}
