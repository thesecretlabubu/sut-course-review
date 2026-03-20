import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import { connectDB } from '@/lib/mongodb'
import Contact from '@/models/Contact'

// GET /api/admin/contacts — admin only
export async function GET(req) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  try {
    await connectDB()
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean()
    
    return Response.json(contacts.map(c => ({
      ...c,
      _id: c._id.toString(),
      createdAt: c.createdAt?.toISOString()
    })))
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST is redundant now as app/api/contact/route.js handles it
export async function POST(req) {
  return Response.json({ error: 'Use /api/contact instead' }, { status: 405 })
}
