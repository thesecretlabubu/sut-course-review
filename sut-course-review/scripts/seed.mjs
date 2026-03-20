// seed.mjs — run with: node scripts/seed.mjs
import mongoose from 'mongoose'
import { config } from 'dotenv'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not set in .env.local')

const CourseSchema = new mongoose.Schema({
  code: String,
  name: String,
  category: String,
  description: String,
  credits: { type: Number, default: 3 },
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
})
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)

const courses = [
  // วิทยาศาสตร์และเทคโนโลยี
  { code: 'IST101', name: 'เทคโนโลยีสารสนเทศ', category: 'วิทยาศาสตร์และเทคโนโลยี', description: 'พื้นฐานเทคโนโลยีสารสนเทศ เน้นทักษะดิจิทัลในยุคปัจจุบัน', credits: 3 },
  { code: 'SCI101', name: 'วิทยาศาสตร์เพื่อชีวิต', category: 'วิทยาศาสตร์และเทคโนโลยี', description: 'เรียนรู้วิทยาศาสตร์ที่เกี่ยวข้องกับชีวิตประจำวัน สุขภาพ และสิ่งแวดล้อม', credits: 3 },
  { code: 'MAT101', name: 'คณิตศาสตร์และสถิติในชีวิตประจำวัน', category: 'วิทยาศาสตร์และเทคโนโลยี', description: 'หลักการคณิตศาสตร์และสถิติที่ใช้งานได้จริง', credits: 3 },
  { code: 'ENV101', name: 'มนุษย์กับสิ่งแวดล้อม', category: 'วิทยาศาสตร์และเทคโนโลยี', description: 'วิทยาศาสตร์สิ่งแวดล้อม การอนุรักษ์ และการพัฒนาที่ยั่งยืน', credits: 3 },
  { code: 'DIG101', name: 'ทักษะดิจิทัล', category: 'วิทยาศาสตร์และเทคโนโลยี', description: 'การใช้เครื่องมือดิจิทัล ความปลอดภัยออนไลน์ และ AI พื้นฐาน', credits: 2 },

  // มนุษยศาสตร์
  { code: 'HUM101', name: 'ความงดงามของชีวิต', category: 'มนุษยศาสตร์', description: 'ปรัชญาชีวิต สุนทรียศาสตร์ และคุณค่าของความเป็นมนุษย์', credits: 3 },
  { code: 'HUM102', name: 'อารยธรรมมนุษย์', category: 'มนุษยศาสตร์', description: 'ประวัติศาสตร์และวัฒนธรรมของอารยธรรมโลก', credits: 3 },
  { code: 'HUM201', name: 'จิตวิทยาเบื้องต้น', category: 'มนุษยศาสตร์', description: 'พื้นฐานจิตวิทยา พฤติกรรมมนุษย์ และการพัฒนาตนเอง', credits: 3 },
  { code: 'ART101', name: 'ศิลปะชื่นชมและสร้างสรรค์', category: 'มนุษยศาสตร์', description: 'ประวัติศาสตร์ศิลปะ การวิจารณ์ผลงาน และกิจกรรมสร้างสรรค์', credits: 3 },

  // สังคมศาสตร์
  { code: 'SOC101', name: 'สังคมและการเมืองไทย', category: 'สังคมศาสตร์', description: 'โครงสร้างสังคมไทย ระบบการเมือง และการปกครอง', credits: 3 },
  { code: 'SOC102', name: 'เศรษฐศาสตร์ในชีวิตประจำวัน', category: 'สังคมศาสตร์', description: 'หลักเศรษฐศาสตร์จุลภาค มหภาค และการตัดสินใจทางการเงิน', credits: 3 },
  { code: 'SOC201', name: 'พลเมืองในโลกสมัยใหม่', category: 'สังคมศาสตร์', description: 'ความเป็นพลเมือง สิทธิมนุษยชน และความรับผิดชอบต่อสังคม', credits: 3 },
  { code: 'SOC202', name: 'กฎหมายในชีวิตประจำวัน', category: 'สังคมศาสตร์', description: 'ความรู้กฎหมายเบื้องต้นที่จำเป็นสำหรับชีวิตประจำวัน', credits: 2 },

  // ภาษา
  { code: 'ENG101', name: 'ภาษาอังกฤษเพื่อการสื่อสาร 1', category: 'ภาษา', description: 'ทักษะภาษาอังกฤษพื้นฐาน ฟัง พูด อ่าน เขียน', credits: 3 },
  { code: 'ENG102', name: 'ภาษาอังกฤษเพื่อการสื่อสาร 2', category: 'ภาษา', description: 'ทักษะภาษาอังกฤษระดับกลาง การสื่อสารทางธุรกิจ', credits: 3 },
  { code: 'ENG201', name: 'ภาษาอังกฤษเชิงวิชาการ', category: 'ภาษา', description: 'การอ่านและเขียนภาษาอังกฤษเชิงวิชาการ บทคัดย่อ และการรายงาน', credits: 3 },
  { code: 'THA101', name: 'ภาษาไทยเพื่อการสื่อสาร', category: 'ภาษา', description: 'ทักษะภาษาไทย การเขียน การอ่าน และการนำเสนอ', credits: 3 },
]

async function seed() {
  try {
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB')

    let added = 0, skipped = 0
    for (const course of courses) {
      const exists = await Course.findOne({ code: course.code })
      if (!exists) {
        await Course.create(course)
        console.log(`  ➕ Added: ${course.code} — ${course.name}`)
        added++
      } else {
        console.log(`  ⏭️  Skip:  ${course.code}`)
        skipped++
      }
    }

    console.log(`\n✅ Done! Added: ${added}, Skipped: ${skipped}`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
