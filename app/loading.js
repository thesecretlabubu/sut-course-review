export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-[#f3f4f5]">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-[#006b2c]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#006b2c] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold text-[#191c1d] animate-pulse" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
        กำลังโหลดข้อมูล...
      </h2>
      <p className="text-[#6e7b6c] mt-2 text-sm">กรุณารอสักครู่ ระบบกำลังเชื่อมต่อฐานข้อมูล</p>
    </div>
  )
}
