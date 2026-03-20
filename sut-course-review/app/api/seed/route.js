import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'

// Real SUT General Education Courses — หมวดวิชาศึกษาทั่วไป (ปรับปรุง พ.ศ. 2566)
// Source: https://beta.sut.ac.th/ist-ge/หมวดรายวิชาศึกษาทั่วไป
const courses = [
  // ── กลุ่มวิชาแกนศึกษาทั่วไป (Core) ──
  {
    code: 'IST20 1005',
    name: 'Metaliteracy (การรู้สารสนเทศและสื่อดิจิทัล)',
    category: 'วิทยาศาสตร์และเทคโนโลยี',
    description: 'การรู้สารสนเทศในยุคดิจิทัล การประเมินแหล่งข้อมูล ทักษะสื่อดิจิทัล และการสร้างเนื้อหาอย่างรับผิดชอบ',
    credits: 4,
    group: 'แกนศึกษาทั่วไป',
  },
  {
    code: 'IST20 1006',
    name: 'Learning Competencies (สมรรถนะการเรียนรู้)',
    category: 'มนุษยศาสตร์',
    description: 'ทักษะการเรียนรู้ การคิดวิเคราะห์ การแก้ปัญหา การทำงานเป็นทีม และการเรียนรู้ตลอดชีวิต',
    credits: 3,
    group: 'แกนศึกษาทั่วไป',
  },
  {
    code: 'IST20 1007',
    name: 'Citizenship (ความเป็นพลเมือง)',
    category: 'สังคมศาสตร์',
    description: 'สิทธิและหน้าที่พลเมือง ประชาธิปไตย สิทธิมนุษยชน และการอยู่ร่วมกันในสังคมพหุวัฒนธรรม',
    credits: 3,
    group: 'แกนศึกษาทั่วไป',
  },

  // ── กลุ่มวิชาภาษา (Language) ──
  {
    code: 'IST30 1101',
    name: 'English for Communication 1 (ภาษาอังกฤษเพื่อการสื่อสาร 1)',
    category: 'ภาษา',
    description: 'ทักษะภาษาอังกฤษขั้นพื้นฐาน ฟัง พูด อ่าน เขียน การสื่อสารในชีวิตประจำวันและสภาพแวดล้อมทางวิชาการ',
    credits: 3,
    group: 'วิชาภาษา',
  },
  {
    code: 'IST30 1102',
    name: 'English for Communication 2 (ภาษาอังกฤษเพื่อการสื่อสาร 2)',
    category: 'ภาษา',
    description: 'ทักษะภาษาอังกฤษในระดับที่สูงขึ้น เน้นการสื่อสารในบริบทสังคมและวิชาชีพ',
    credits: 3,
    group: 'วิชาภาษา',
  },
  {
    code: 'IST30 1103',
    name: 'English for Academic Purposes (ภาษาอังกฤษเพื่อวัตถุประสงค์ทางวิชาการ)',
    category: 'ภาษา',
    description: 'ทักษะภาษาอังกฤษเชิงวิชาการ การอ่านบทความ การเขียนเชิงวิชาการ และการนำเสนอ',
    credits: 3,
    group: 'วิชาภาษา',
  },
  {
    code: 'IST30 1104',
    name: 'English for Specific Purposes (ภาษาอังกฤษเพื่อวัตถุประสงค์เฉพาะ)',
    category: 'ภาษา',
    description: 'ภาษาอังกฤษที่ใช้ในสาขาวิชาชีพเฉพาะ เช่น วิศวกรรมศาสตร์ วิทยาศาสตร์ หรือธุรกิจ',
    credits: 3,
    group: 'วิชาภาษา',
  },
  {
    code: 'IST30 1105',
    name: 'English for Careers (ภาษาอังกฤษเพื่อการทำงาน)',
    category: 'ภาษา',
    description: 'ภาษาอังกฤษสำหรับการสมัครงาน การสัมภาษณ์ การเขียน Resume และการสื่อสารในองค์กร',
    credits: 3,
    group: 'วิชาภาษา',
  },

  // ── กลุ่มวิชาศึกษาทั่วไปแบบเลือก — สังคมศาสตร์และมนุษยศาสตร์ ──
  {
    code: 'IST20 1505',
    name: 'Art Appreciation (ศิลปวิจักษ์)',
    category: 'มนุษยศาสตร์',
    description: 'ทฤษฎีและการวิจารณ์งานศิลปะ ดนตรี ภาพยนตร์ และวรรณกรรม เพื่อพัฒนาสุนทรียภาพ',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 1506',
    name: 'Holistic Health (สุขภาพองค์รวม)',
    category: 'วิทยาศาสตร์และเทคโนโลยี',
    description: 'สุขภาพกายและใจ โภชนาการ การออกกำลังกาย สุขภาพจิต และการดูแลตนเองอย่างองค์รวม',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 1507',
    name: 'Law in Daily Life (กฎหมายในชีวิตประจำวัน)',
    category: 'สังคมศาสตร์',
    description: 'กฎหมายแพ่ง อาญา แรงงาน ผู้บริโภค และสิทธิที่พลเมืองควรรู้ในชีวิตประจำวัน',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 1508',
    name: 'Ways of Lower Isan (แนวอีสานใต้)',
    category: 'มนุษยศาสตร์',
    description: 'วัฒนธรรม ประเพณี ภูมิปัญญาท้องถิ่น และอัตลักษณ์ของภาคอีสานใต้',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 1509',
    name: 'Effective Communication (การสื่อสารอย่างมีประสิทธิภาพ)',
    category: 'มนุษยศาสตร์',
    description: 'หลักการสื่อสาร ทักษะการพูดในที่สาธารณะ การฟังเชิงรุก และการเจรจาต่อรอง',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 1510',
    name: 'Virtual Community (ชุมชนเสมือนจริง)',
    category: 'วิทยาศาสตร์และเทคโนโลยี',
    description: 'สังคมออนไลน์ โซเชียลมีเดีย การสร้างชุมชนดิจิทัล และผลกระทบต่อสังคม',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 2506',
    name: 'Professional and Community Engagement (พันธกิจสัมพันธ์ชุมชนกับกลุ่มอาชีพ)',
    category: 'สังคมศาสตร์',
    description: 'การเรียนรู้ผ่านการบริการสังคม ความรับผิดชอบต่อชุมชน และการทำงานร่วมกับกลุ่มอาชีพต่างๆ',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 2507',
    name: 'ASEAN Studies (อาเซียนศึกษา)',
    category: 'สังคมศาสตร์',
    description: 'ประชาคมอาเซียน วัฒนธรรม เศรษฐกิจ และความสัมพันธ์ระหว่างประเทศในภูมิภาค',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 2508',
    name: 'Love Yourself (ฮักเจ้าของ)',
    category: 'มนุษยศาสตร์',
    description: 'จิตวิทยาเชิงบวก การรักตนเอง การสร้างความเชื่อมั่น และการพัฒนาบุคลิกภาพ',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 2509',
    name: 'Discourses and Worldview Change (วาทกรรมเปลี่ยนโลกทัศน์)',
    category: 'มนุษยศาสตร์',
    description: 'วิเคราะห์วาทกรรมในสังคม สื่อ การเมือง และผลกระทบต่อโลกทัศน์และการรับรู้ของผู้คน',
    credits: 2,
    group: 'วิชาเลือก',
  },
  {
    code: 'IST20 2510',
    name: 'Circular Economy Lifestyle (วิถีชีวิตเศรษฐกิจหมุนเวียน)',
    category: 'สังคมศาสตร์',
    description: 'เศรษฐกิจหมุนเวียน การลดขยะ การบริโภคอย่างยั่งยืน และการออกแบบชีวิตที่เป็นมิตรกับสิ่งแวดล้อม',
    credits: 3,
    group: 'วิชาเลือก',
  },
]

export async function GET() {
  try {
    await connectDB()

    // Clear old fake courses, keep real ones if already seeded
    const results = []
    let added = 0, skipped = 0

    for (const course of courses) {
      const exists = await Course.findOne({ code: course.code })
      if (!exists) {
        await Course.create(course)
        results.push(`ADDED: ${course.code}`)
        added++
      } else {
        // Update description/credits in case it changed
        await Course.findOneAndUpdate({ code: course.code }, {
          name: course.name,
          category: course.category,
          description: course.description,
          credits: course.credits,
        })
        results.push(`UPDATED: ${course.code}`)
        skipped++
      }
    }

    return Response.json({
      success: true,
      message: `Added ${added} new courses, updated ${skipped} existing courses`,
      total: courses.length,
      results,
    })
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
