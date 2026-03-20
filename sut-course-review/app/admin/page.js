import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import AdminClient from './AdminClient'

export const metadata = { title: 'Admin — SUT Review' }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.email)) {
    redirect('/')
  }
  return <AdminClient adminName={session.user.name} adminEmail={session.user.email} />
}
