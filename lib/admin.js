/**
 * Check if a given email is in the ADMIN_EMAILS env variable.
 * Set ADMIN_EMAILS as a comma-separated list in .env.local:
 *   ADMIN_EMAILS=you@gmail.com,other@gmail.com
 */
export function isAdmin(email) {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  return adminEmails.includes(email.toLowerCase())
}
