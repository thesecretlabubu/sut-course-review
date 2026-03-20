'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-[#e7e8e9]" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
          <img src="/logo.png" alt="SUT Review Logo" className="w-8 h-8 object-contain" />
          <span>SUT Review</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/courses" className="text-slate-600 hover:text-[#006b2c] transition-colors" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            วิชาทั้งหมด
          </Link>
          <Link href="/courses" className="text-slate-600 hover:text-[#006b2c] transition-colors" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            ค้นหา
          </Link>
        </div>

        {/* Auth Button */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full border-2 border-[#006b2c]"
                />
              )}
              <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {session.user?.name}
              </span>
              <Link
                href="/admin"
                className="text-sm text-slate-500 hover:text-[#006b2c] font-medium transition-colors hidden md:block"
                title="Admin Panel"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-slate-500 hover:text-[#006b2c] font-medium transition-colors hidden md:block"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-2 bg-[#006b2c] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#00873a] transition-all active:scale-95 text-sm"
              style={{ fontFamily: 'Inter, Sarabun, sans-serif' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login with Google
            </button>
          )}

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#e7e8e9]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined text-slate-600">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e7e8e9] bg-white px-6 py-4 space-y-3">
          <Link href="/courses" className="block text-slate-700 font-medium hover:text-[#006b2c]" onClick={() => setMenuOpen(false)}>
            วิชาทั้งหมด
          </Link>
          {session ? (
            <button onClick={() => { signOut(); setMenuOpen(false) }} className="block text-slate-500 text-sm">
              ออกจากระบบ ({session.user?.name})
            </button>
          ) : (
            <button onClick={() => { signIn('google'); setMenuOpen(false) }} className="block text-[#006b2c] font-medium text-sm">
              Login with Google
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
