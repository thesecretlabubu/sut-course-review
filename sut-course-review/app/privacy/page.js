export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว — SUT Course Review',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f5] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#191c1d] mb-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="text-xs text-[#6e7b6c] mb-8">อัปเดตล่าสุด: มีนาคม 2568</p>

          <div className="space-y-8 text-sm text-[#3e4a3d] leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">1. ข้อมูลที่เราเก็บรวบรวม</h2>
              <p>เมื่อคุณ login ด้วย Google เราได้รับข้อมูล: ชื่อ, อีเมล และรูปโปรไฟล์จาก Google OAuth
                ซึ่งถูกใช้เพื่อแสดงชื่อในรีวิวและป้องกันการรีวิวซ้ำซ้อน</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">2. การใช้ข้อมูล</h2>
              <ul className="list-disc list-inside space-y-1 text-[#6e7b6c]">
                <li>แสดงชื่อในรีวิว (ถ้าไม่เลือก Anonymous)</li>
                <li>ตรวจสอบสิทธิ์การรีวิว 1 ครั้งต่อวิชา</li>
                <li>ป้องกัน Spam และการใช้งานที่ไม่เหมาะสม</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">3. การแชร์ข้อมูล</h2>
              <p>เราไม่ขาย ไม่แชร์ และไม่ส่งต่อข้อมูลส่วนตัวของคุณให้บุคคลที่สาม
                ข้อมูลทั้งหมดถูกเก็บใน MongoDB Atlas บน Cloud ที่ปลอดภัย</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">4. คุกกี้</h2>
              <p>เราใช้ Cookie สำหรับ Session Authentication (NextAuth.js) เท่านั้น
                ไม่มี Tracking Cookie หรือ Cookie โฆษณา</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">5. สิทธิ์ของคุณ</h2>
              <p>คุณสามารถขอลบข้อมูลส่วนตัวของคุณออกจากระบบได้ตลอดเวลา
                โดยติดต่อมาที่{' '}
                <a href="/contact" className="text-[#006b2c] hover:underline">หน้าติดต่อเรา</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
