import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-[#e1e3e4] bg-white mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-900 text-lg" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            <img src="/logo.png" alt="SUT Review Logo" className="w-6 h-6 object-contain opacity-80" />
            <span>SUT Course Review</span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500">
            แพลตฟอร์มรีวิวรายวิชาโดยนักศึกษา เพื่อนักศึกษา
            มหาวิทยาลัยเทคโนโลยีสุรนารี
          </p>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>เมนู</h4>
          <Link href="/courses" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">วิชาทั้งหมด</Link>
          <Link href="/courses?sort=rating" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">วิชายอดนิยม</Link>
          <Link href="/about" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">เกี่ยวกับเรา</Link>
        </div>

        {/* Help */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>ช่วยเหลือ</h4>
          <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">นโยบายความเป็นส่วนตัว</Link>
          <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">ข้อตกลงการใช้งาน</Link>
          <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">ติดต่อสอบถาม</Link>
        </div>

        {/* External */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>ลิงก์ภายนอก</h4>
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
          © {new Date().getFullYear()} SUT Course Review · Suranaree University of Technology · ข้อมูลจากนักศึกษาเพื่อนักศึกษา
        </p>
      </div>
    </footer>
  )
}
