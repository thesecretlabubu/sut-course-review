export const metadata = {
  title: 'ข้อตกลงการใช้งาน — SUT Course Review',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f5] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#191c1d] mb-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            ข้อตกลงการใช้งาน
          </h1>
          <p className="text-xs text-[#6e7b6c] mb-8">อัปเดตล่าสุด: มีนาคม 2568</p>

          <div className="space-y-8 text-sm text-[#3e4a3d] leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">1. การยอมรับข้อตกลง</h2>
              <p>การใช้งานแพลตฟอร์ม SUT Course Review ถือว่าคุณยอมรับข้อตกลงนี้ทุกประการ
                หากไม่เห็นด้วย กรุณางดใช้งาน</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">2. คุณสมบัติของผู้ใช้</h2>
              <p>แพลตฟอร์มนี้มีไว้สำหรับนักศึกษา อาจารย์ และบุคลากรของมหาวิทยาลัยเทคโนโลยีสุรนารีเป็นหลัก
                การ login ต้องใช้บัญชี Google ที่ถูกต้อง</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">3. กฎของการรีวิว</h2>
              <ul className="list-disc list-inside space-y-1 text-[#6e7b6c]">
                <li>ต้องเคยเรียนวิชานั้นจริงก่อนรีวิว</li>
                <li>งดใช้คำหยาบ คำดูถูก หรือเนื้อหาที่ทำร้ายบุคคลอื่น</li>
                <li>งดเผยแพร่ข้อมูลส่วนตัวของผู้อื่น</li>
                <li>งด Spam หรือรีวิวซ้ำ</li>
                <li>รีวิวได้ 1 ครั้งต่อ 1 วิชา</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">4. การลบเนื้อหา</h2>
              <p>ทีมงานขอสงวนสิทธิ์ในการลบรีวิวที่ละเมิดกฎดังกล่าวโดยไม่ต้องแจ้งล่วงหน้า
                และอาจระงับการใช้งานของผู้ที่ละเมิดซ้ำ</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">5. ข้อจำกัดความรับผิดชอบ</h2>
              <p>รีวิวทั้งหมดเป็นความคิดเห็นส่วนตัวของผู้เขียน ไม่ใช่จุดยืนอย่างเป็นทางการของ มทส
                ทีมงานไม่รับผิดชอบต่อความถูกต้องของข้อมูลในรีวิว</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
