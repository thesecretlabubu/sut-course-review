'use client'

import { signIn } from 'next-auth/react'

export default function LoginButton({ label, className, icon = 'login' }) {
  return (
    <button
      onClick={() => signIn('google')}
      className={className}
    >
      {label} {icon && <span className="material-symbols-outlined">{icon}</span>}
    </button>
  )
}
