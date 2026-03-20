'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const languages = [
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'en', name: 'EN', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export default function Navbar({ lang = 'th' }) {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLangChange = (newLang) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  // Simplified translations for the Navbar
  const t = {
    th: {
      allCourses: 'วิชาทั้งหมด',
      search: 'ค้นหา',
      signOut: 'ออกจากระบบ',
      login: 'เข้าสู่ระบบด้วย Google',
    },
    en: {
      allCourses: 'All Courses',
      search: 'Search',
      signOut: 'Sign Out',
      login: 'Login with Google',
    },
    zh: {
      allCourses: '所有课程',
      search: '搜索',
      signOut: '退出登录',
      login: '使用 Google 登录',
    }
  }[lang] || {
    allCourses: 'วิชาทั้งหมด',
    search: 'ค้นหา',
    signOut: 'ออกจากระบบ',
    login: 'เข้าสู่ระบบด้วย Google',
  }

  const currentLang = languages.find(l => l.code === lang) || languages[0]

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-[#e7e8e9]" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
          <img src="/logo.png" alt="SUT Review Logo" className="w-8 h-8 object-contain" />
          <span>SUT Review</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href={`/${lang}/courses`} className="text-slate-600 hover:text-[#006b2c] transition-colors" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            {t.allCourses}
          </Link>
          <Link href={`/${lang}/courses`} className="text-slate-600 hover:text-[#006b2c] transition-colors" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            {t.search}
          </Link>
        </div>

        {/* Action area */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-600"
            >
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.name}</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-[#006b2c] font-bold bg-[#006b2c]/5' : 'text-slate-600'}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full border-2 border-[#006b2c]"
                />
              )}
              <span className="hidden lg:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {session.user?.name}
              </span>
              <Link
                href={`/${lang}/admin`}
                className="text-sm text-slate-500 hover:text-[#006b2c] font-medium transition-colors hidden md:block"
                title="Admin Panel"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-slate-500 hover:text-[#006b2c] font-medium transition-colors hidden md:block"
              >
                {t.signOut}
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
              <span className="hidden sm:inline">{t.login}</span>
            </button>
          )}

          {/* Mobile menu button */}
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
          <Link href={`/${lang}/courses`} className="block text-slate-700 font-medium hover:text-[#006b2c]" onClick={() => setMenuOpen(false)}>
            {t.allCourses}
          </Link>
          {session ? (
            <button onClick={() => { signOut(); setMenuOpen(false) }} className="block text-slate-500 text-sm">
              {t.signOut} ({session.user?.name})
            </button>
          ) : (
            <button onClick={() => { signIn('google'); setMenuOpen(false) }} className="block text-[#006b2c] font-medium text-sm">
              {t.login}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
