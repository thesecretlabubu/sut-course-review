export const metadata = {
  title: 'เกี่ยวกับเรา — SUT Course Review',
  description: 'SUT Course Review คืออะไร ทำไมถึงสร้าง และวิสัยทัศน์ของเรา',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f5] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img src="/logo.png" alt="SUT Review Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-4xl font-extrabold text-[#191c1d] mb-4" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            เกี่ยวกับ SUT Review
          </h1>
          <p className="text-[#6e7b6c] text-lg leading-relaxed">
            แพลตฟอร์มรีวิวรายวิชา โดยนักศึกษา มทส เพื่อนักศึกษา มทส
          </p>
        </div>

        <div className="space-y-6">
          {/* Origin */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#191c1d] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              <span className="material-symbols-outlined text-[#006b2c]">lightbulb</span>
              ที่มาของโปรเจกต์
            </h2>
            <p className="text-[#3e4a3d] leading-relaxed text-sm">
              SUT Course Review เกิดจากปัญหาที่นักศึกษาหลายคนเจอ — ไม่รู้ว่าวิชา GE ที่จะลงนั้น
              เป็นอย่างไร ยากแค่ไหน งานเยอะหรือเปล่า อาจารย์สอนดีไหม
              ข้อมูลเหล่านี้มักกระจัดกระจายอยู่ตาม GroupChat หรือ Line กลุ่ม
              โปรเจกต์นี้จึงรวบรวมและจัดระเบียบรีวิวให้อยู่ในที่เดียว
              เพื่อให้น้องๆ ตัดสินใจได้ง่ายขึ้น
            </p>
          </section>

          {/* Mission */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#191c1d] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              <span className="material-symbols-outlined text-[#006b2c]">flag</span>
              พันธกิจ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: 'verified', title: 'ข้อมูลจริง', desc: 'รีวิวจากผู้เรียนจริง ไม่ใช่ข้อมูลสำเร็จรูป' },
                { icon: 'groups', title: 'ชุมชนแข็งแกร่ง', desc: 'นักศึกษาช่วยนักศึกษา ข้ามรุ่นข้ามสาขา' },
                { icon: 'school', title: 'การศึกษาดีขึ้น', desc: 'ตัดสินใจลงวิชาได้ตรงกับตัวเองมากขึ้น' },
              ].map(m => (
                <div key={m.title} className="bg-[#f3f4f5] rounded-xl p-5 text-center">
                  <span className="material-symbols-outlined text-3xl text-[#006b2c] block mb-2">{m.icon}</span>
                  <p className="font-bold text-sm text-[#191c1d] mb-1">{m.title}</p>
                  <p className="text-xs text-[#6e7b6c] leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#191c1d] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
              <span className="material-symbols-outlined text-[#006b2c]">code</span>
              เทคโนโลยีที่ใช้
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js 16', 'MongoDB Atlas', 'NextAuth.js', 'Tailwind CSS', 'Google OAuth'].map(t => (
                <span key={t} className="bg-[#baecbc]/50 text-[#006b2c] text-xs font-bold px-3 py-1.5 rounded-full">{t}</span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pt-4">
            <p className="text-sm text-[#6e7b6c] mb-4">มีข้อเสนอแนะหรืออยากร่วมพัฒนา?</p>
            <a href="/contact"
              className="inline-flex items-center gap-2 bg-[#006b2c] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00873a] transition-all">
              <span className="material-symbols-outlined text-sm">mail</span>
              ติดต่อเรา
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
