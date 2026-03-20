import { Resend } from 'resend'
import { connectDB } from '@/lib/mongodb'
import Contact from '@/models/Contact'
import DOMPurify from 'isomorphic-dompurify'

const resend = new Resend(process.env.RESEND_API_KEY)

const SUBJECT_LABELS = {
  bug: 'รายงาน Bug',
  suggestion: 'ข้อเสนอแนะ',
  content: 'เนื้อหาไม่เหมาะสม',
  privacy: 'ข้อมูลส่วนตัว',
  other: 'อื่นๆ',
}

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'ข้อมูลไม่ครบ' }, { status: 400 })
    }

    const sanitizedMessage = DOMPurify.sanitize(message)
    const refId = `SUT-${Date.now().toString(36).toUpperCase()}`
    const subjectLabel = SUBJECT_LABELS[subject] || subject

    // Save to MongoDB
    await connectDB()
    await Contact.create({ name, email, subject: subjectLabel, message: sanitizedMessage, refId })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'SUT Course Review <onboarding@resend.dev>',
      to: email,
      subject: `[SUT Course Review] เราได้รับข้อความของคุณแล้ว — ${subjectLabel}`,
      html: `
        <!DOCTYPE html>
        <html lang="th">
        <head><meta charset="utf-8"/></head>
        <body style="margin:0;padding:0;background:#f3f4f5;font-family:'Sarabun',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f5;padding:40px 20px;">
            <tr><td align="center">
              <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#006b2c 0%,#00873a 100%);padding:32px;text-align:center;">
                    <div style="font-size:28px;margin-bottom:8px;">🎓</div>
                    <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;">SUT Course Review</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px 40px 32px;">
                    <div style="text-align:center;margin-bottom:28px;">
                      <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#baecbc;border-radius:50%;margin-bottom:16px;">
                        <span style="font-size:32px;">✓</span>
                      </div>
                      <h2 style="color:#191c1d;font-size:24px;font-weight:700;margin:0 0 8px;">เราได้รับข้อความของคุณแล้ว</h2>
                      <p style="color:#6e7b6c;margin:0;font-size:15px;line-height:1.6;">
                        ขอบคุณที่ติดต่อสอบถามเข้ามา<br/>ทีมงานจะรีบตรวจสอบและตอบกลับโดยเร็ว
                      </p>
                    </div>

                    <!-- Summary Card -->
                    <div style="background:#f3f4f5;border-radius:12px;padding:20px;margin-bottom:28px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="color:#6e7b6c;font-size:13px;padding:4px 0;width:120px;">Reference ID</td>
                          <td style="color:#191c1d;font-size:13px;font-weight:700;padding:4px 0;">#${refId}</td>
                        </tr>
                        <tr>
                          <td style="color:#6e7b6c;font-size:13px;padding:4px 0;">ชื่อ-สกุล</td>
                          <td style="color:#191c1d;font-size:13px;padding:4px 0;">${name}</td>
                        </tr>
                        <tr>
                          <td style="color:#6e7b6c;font-size:13px;padding:4px 0;">หัวข้อ</td>
                          <td style="color:#191c1d;font-size:13px;padding:4px 0;">${subjectLabel}</td>
                        </tr>
                        <tr>
                          <td style="color:#6e7b6c;font-size:13px;padding:4px 0;vertical-align:top;">ข้อความ</td>
                          <td style="color:#191c1d;font-size:13px;padding:4px 0;">${sanitizedMessage}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- CTA -->
                    <div style="text-align:center;">
                      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}"
                        style="display:inline-block;background:linear-gradient(135deg,#006b2c 0%,#00873a 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
                        กลับสู่หน้าหลัก
                      </a>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#f8f9fa;border-top:1px solid #e1e3e4;padding:20px 40px;text-align:center;">
                    <p style="color:#6e7b6c;font-size:12px;margin:0;line-height:1.6;">
                      อีเมลนี้ส่งจากระบบ SUT Course Review อัตโนมัติ กรุณาอย่าตอบกลับ<br/>
                      © ${new Date().getFullYear()} SUT Course Review
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    return Response.json({ success: true, refId })
  } catch (err) {
    console.error('Contact email error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
