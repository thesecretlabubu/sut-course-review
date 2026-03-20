'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitReview } from '@/app/actions/reviewActions'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

const SEMESTERS = ['1/2567', '2/2567', '3/2567', '1/2566', '2/2566', '3/2566', '1/2565', '2/2565', '3/2565', '1/2564', '2/2564', '3/2564']
const GRADES = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F']

const STAR_LABELS_DICT = {
  th: {
    ratingFun: {
      label: 'ความสนุก',
      low: 'ไม่สนุกเลย', high: 'สนุกมาก',
      levels: ['', 'น่าเบื่อมาก', 'ค่อนข้างน่าเบื่อ', 'พอใช้', 'ค่อนข้างสนุก', 'สนุกมาก'],
    },
    ratingWorkload: {
      label: 'ปริมาณงาน',
      low: 'งานน้อยมาก', high: 'งานเยอะมาก',
      levels: ['', 'งานน้อยมาก', 'งานน้อย', 'ปานกลาง', 'งานเยอะ', 'งานเยอะมาก'],
    },
    ratingDifficulty: {
      label: 'ความยาก',
      low: 'ง่ายมาก', high: 'ยากมาก',
      levels: ['', 'ง่ายมาก', 'ค่อนข้างง่าย', 'ปานกลาง', 'ค่อนข้างยาก', 'ยากมาก'],
    },
    pleaseSelect: 'กรุณาเลือก'
  },
  en: {
    ratingFun: {
      label: 'Fun',
      low: 'Not fun', high: 'Very fun',
      levels: ['', 'Very boring', 'Boring', 'Fair', 'Fun', 'Very fun'],
    },
    ratingWorkload: {
      label: 'Workload',
      low: 'Very light', high: 'Very heavy',
      levels: ['', 'Very light', 'Light', 'Moderate', 'Heavy', 'Very heavy'],
    },
    ratingDifficulty: {
      label: 'Difficulty',
      low: 'Very easy', high: 'Very hard',
      levels: ['', 'Very easy', 'Easy', 'Moderate', 'Hard', 'Very hard'],
    },
    pleaseSelect: 'Please select'
  },
  zh: {
    ratingFun: {
      label: '趣味性',
      low: '一点也不好玩', high: '非常好玩',
      levels: ['', '非常无聊', '比较无聊', '一般', '比较有趣', '非常好玩'],
    },
    ratingWorkload: {
      label: '工作量',
      low: '非常少', high: '非常多',
      levels: ['', '非常少', '比较少', '中等', '比较多', '非常多'],
    },
    ratingDifficulty: {
      label: '难度',
      low: '非常容易', high: '非常难',
      levels: ['', '非常容易', '比较容易', '中等', '比较难', '非常难'],
    },
    pleaseSelect: '请选择'
  }
}

function StarPicker({ name, lang, icon }) {
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(0)
  const dict = STAR_LABELS_DICT[lang] || STAR_LABELS_DICT.en
  const meta = dict[name]
  const active = hover || selected

  return (
    <div className="bg-[#f3f4f5] p-5 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#006b2c]">{icon}</span>
        <span className="font-bold text-sm text-[#3e4a3d]">{meta?.label}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} type="button"
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
            onClick={() => setSelected(i)} className="focus:outline-none" title={meta?.levels[i]}>
            <span className="material-symbols-outlined text-3xl transition-colors"
              style={{ fontVariationSettings: i <= active ? "'FILL' 1" : "'FILL' 0", color: i <= active ? '#f59e0b' : '#d1d5db' }}>
              star
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-slate-400">{meta?.low}</span>
        {active > 0
          ? <span className="text-xs font-bold text-[#006b2c] bg-[#baecbc]/50 px-2 py-0.5 rounded-full">{meta?.levels[active]}</span>
          : <span className="text-[10px] text-slate-400 italic">{dict.pleaseSelect}</span>
        }
        <span className="text-[10px] text-slate-400">{meta?.high}</span>
      </div>
      <input type="hidden" name={name} value={selected} />
    </div>
  )
}

function SubmitButton({ lang }) {
  const { pending } = useFormStatus()
  const t = {
    th: { sending: 'กำลังส่ง...', send: 'ส่งรีวิว' },
    en: { sending: 'Sending...', send: 'Submit Review' },
    zh: { sending: '发送中...', send: '提交评价' }
  }[lang] || { sending: 'Sending...', send: 'Submit Review' }

  return (
    <button type="submit" disabled={pending}
      className="w-full md:w-auto px-10 py-3 rounded-xl font-bold bg-[#006b2c] text-white hover:bg-[#00873a] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
      {pending
        ? <><span className="material-symbols-outlined text-sm animate-spin">refresh</span>{t.sending}</>
        : <>{t.send} <span className="material-symbols-outlined text-sm">check_circle</span></>
      }
    </button>
  )
}

export default function WriteReviewForm({ courseId, courseCode, lang }) {
  const boundAction = submitReview.bind(null, courseId, lang)

  const wrappedAction = async (prev, formData) => {
    try {
      const result = await boundAction(formData)
      if (result?.error) {
        return { error: result.error }
      }
      return { error: null }
    } catch (err) {
      if (isRedirectError(err)) throw err
      return { error: 'An error occurred. Please try again.' }
    }
  }

  const [state, formAction] = useActionState(wrappedAction, { error: null })

  const t = {
    th: {
      semester: 'เทอมที่เรียน',
      grade: 'เกรดที่ได้',
      rateTitle: 'ให้คะแนนวิชา',
      comment: 'ความคิดเห็น',
      placeholder: 'เล่าประสบการณ์ อาจารย์ผู้สอน สไตล์การสอน ข้อสอบ หรือคำแนะนำสำหรับรุ่นน้อง...',
      anonymous: 'ไม่แสดงชื่อ (Anonymous)',
      cancel: 'ยกเลิก'
    },
    en: {
      semester: 'Semester',
      grade: 'Grade Received',
      rateTitle: 'Rate this course',
      comment: 'Comment',
      placeholder: 'Share your experience, teaching style, exams, or advice for juniors...',
      anonymous: 'Anonymous',
      cancel: 'Cancel'
    },
    zh: {
      semester: '上课学期',
      grade: '所获成绩',
      rateTitle: '为本课程评分',
      comment: '评价内容',
      placeholder: '分享你的经验、教学风格、考试内容或给学弟学妹的建议...',
      anonymous: '匿名提交',
      cancel: '取消'
    }
  }[lang] || { semester: 'Semester', grade: 'Grade', rateTitle: 'Rate', comment: 'Comment', placeholder: '...', anonymous: 'Anonymous', cancel: 'Cancel' }

  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#006b2c]/5 rounded-bl-full -mr-16 -mt-16" />

      {state?.error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-8 relative">
        <input type="hidden" name="courseCode" value={courseCode} />

        {/* Semester + Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#3e4a3d]">{t.semester}</label>
            <div className="relative">
              <select name="semester" required
                className="w-full bg-[#f3f4f5] border-0 focus:ring-2 focus:ring-[#006b2c] rounded-xl px-4 py-3 appearance-none text-[#191c1d]">
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e7b6c]">expand_more</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#3e4a3d]">{t.grade}</label>
            <div className="relative">
              <select name="gradeReceived" required
                className="w-full bg-[#f3f4f5] border-0 focus:ring-2 focus:ring-[#006b2c] rounded-xl px-4 py-3 appearance-none text-[#191c1d]">
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e7b6c]">expand_more</span>
            </div>
          </div>
        </div>

        {/* Star ratings */}
        <div>
          <p className="text-sm font-bold text-[#3e4a3d] mb-3">{t.rateTitle} <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StarPicker name="ratingFun" lang={lang} icon="sentiment_satisfied" />
            <StarPicker name="ratingWorkload" lang={lang} icon="work_history" />
            <StarPicker name="ratingDifficulty" lang={lang} icon="psychology" />
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#3e4a3d]">{t.comment}</label>
          <textarea name="comment" rows={5}
            className="w-full bg-[#f3f4f5] border-0 focus:ring-2 focus:ring-[#006b2c] rounded-xl px-4 py-4 text-[#191c1d] placeholder:text-slate-400 resize-none"
            placeholder={t.placeholder} />
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center gap-3 py-1">
          <label className="relative flex items-center cursor-pointer gap-3">
            <input type="checkbox" name="isAnonymous" className="sr-only peer" />
            <div className="w-11 h-6 bg-[#bdcaba] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006b2c]" />
            <span className="text-sm font-medium text-[#3e4a3d]">{t.anonymous}</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-4">
          <a href={`/${lang}/courses/${courseId}`}
            className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-[#6e7b6c] hover:bg-[#edeeef] transition-colors text-center">
            {t.cancel}
          </a>
          <SubmitButton lang={lang} />
        </div>
      </form>
    </div>
  )
}
