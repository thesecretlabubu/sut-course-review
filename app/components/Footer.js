import Link from 'next/link'

export default function Footer({ lang = 'th' }) {
  const t = {
    th: {
      brandDesc: 'แพลตฟอร์มรีวิวรายวิชาโดยนักศึกษา เพื่อนักศึกษา มหาวิทยาลัยเทคโนโลยีสุรนารี',
      menu: 'เมนู',
      allCourses: 'วิชาทั้งหมด',
      popularCourses: 'วิชายอดนิยม',
      about: 'เกี่ยวกับเรา',
      help: 'ช่วยเหลือ',
      privacy: 'นโยบายความเป็นส่วนตัว',
      terms: 'ข้อตกลงการใช้งาน',
      contact: 'ติดต่อสอบถาม',
      external: 'ลิงก์ภายนอก',
      copy: `© ${new Date().getFullYear()} SUT Course Review · Suranaree University of Technology · ข้อมูลจากนักศึกษาเพื่อนักศึกษา`
    },
    en: {
      brandDesc: 'Course review platform for students by students, Suranaree University of Technology.',
      menu: 'Menu',
      allCourses: 'All Courses',
      popularCourses: 'Popular Courses',
      about: 'About Us',
      help: 'Help',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      contact: 'Contact Us',
      external: 'External Links',
      copy: `© ${new Date().getFullYear()} SUT Course Review · Suranaree University of Technology · By students, for students`
    },
    zh: {
      brandDesc: '由学生为学生打造的课程评估平台，苏兰拉里理工大学。',
      menu: '菜单',
      allCourses: '所有课程',
      popularCourses: '热门课程',
      about: '关于我们',
      help: '帮助',
      privacy: '隐私政策',
      terms: '使用条款',
      contact: '联系我们',
      external: '外部链接',
      copy: `© ${new Date().getFullYear()} SUT Course Review · 苏兰拉里理工大学 · 学生为学弟学妹提供的信息`
    }
  }[lang] || {}

  return (
    <footer className="w-full py-12 px-6 border-t border-[#e1e3e4] bg-white mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href={`/${lang}`} className="flex items-center gap-2 font-extrabold text-slate-900 text-lg" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            <img src="/logo.png" alt="SUT Review Logo" className="w-6 h-6 object-contain opacity-80" />
            <span>SUT Course Review</span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500">
            {t.brandDesc}
          </p>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>{t.menu}</h4>
          <Link href={`/${lang}/courses`} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">{t.allCourses}</Link>
          <Link href={`/${lang}/courses?sort=rating`} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">{t.popularCourses}</Link>
          <Link href={`/${lang}/about`} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">{t.about}</Link>
        </div>

        {/* Help */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>{t.help}</h4>
          <Link href={`/${lang}/privacy`} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">{t.privacy}</Link>
          <Link href={`/${lang}/terms`} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">{t.terms}</Link>
          <Link href={`/${lang}/contact`} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">{t.contact}</Link>
        </div>

        {/* External */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>{t.external}</h4>
          <a href="https://reg.sut.ac.th" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
            Reg SUT <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
          <a href="https://www.sut.ac.th" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
            SUT Portal <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#e1e3e4]">
        <p className="text-xs text-slate-400 text-center">
          {t.copy}
        </p>
      </div>
    </footer>
  )
}
