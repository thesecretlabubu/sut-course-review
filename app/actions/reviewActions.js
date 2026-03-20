'use server'

import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Course from '@/models/Course'
import { auth } from '@/lib/auth'

export async function submitReview(courseId, lang, formData) {
  const session = await auth()
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/${lang}/courses/${courseId}/write-review`)
  }

  try {
    const courseCode = formData.get('courseCode')
    const semester = formData.get('semester')
    const gradeReceived = formData.get('gradeReceived')
    const ratingFun = parseInt(formData.get('ratingFun') || '0')
    const ratingWorkload = parseInt(formData.get('ratingWorkload') || '0')
    const ratingDifficulty = parseInt(formData.get('ratingDifficulty') || '0')
    const comment = formData.get('comment') || ''
    const isAnonymous = formData.get('isAnonymous') === 'on'
    const userId = session.user.id || session.user.email

    // Validate star ratings — must all be 1-5
    if (ratingFun < 1 || ratingWorkload < 1 || ratingDifficulty < 1) {
      const msg = {
        th: 'กรุณาให้คะแนนทุกหมวด (ความสนุก, ปริมาณงาน, ความยาก)',
        en: 'Please provide ratings for all categories (Fun, Workload, Difficulty)',
        zh: '请为所有项目评分（趣味性、工作量、难度）'
      }[lang] || 'Please provide ratings for all categories'
      return { error: msg }
    }

    await connectDB()

    // 1-review-per-course-per-user guard
    const existing = await Review.findOne({ courseCode, userId })
    if (existing) {
      const msg = {
        th: 'คุณได้รีวิววิชานี้ไปแล้ว',
        en: 'You have already reviewed this course',
        zh: '您已经评价过这门课了'
      }[lang] || 'Already reviewed'
      return { error: msg }
    }

    // Create review
    await Review.create({
      courseCode,
      userId,
      userEmail: session.user.email,
      userName: session.user.name,
      isAnonymous,
      semester,
      gradeReceived,
      ratingFun,
      ratingWorkload,
      ratingDifficulty,
      comment,
    })

    // Recalculate course avgRating & totalReviews
    const allReviews = await Review.find({ courseCode })
    const total = allReviews.length
    const avgRating = total > 0
      ? allReviews.reduce((sum, r) => {
          const score = ((r.ratingFun || 0) + (r.ratingWorkload || 0) + (r.ratingDifficulty || 0)) / 3
          return sum + score
        }, 0) / total
      : 0

    await Course.findByIdAndUpdate(courseId, {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: total,
    })
  } catch (err) {
    console.error('submitReview Error:', err)
    return { error: err.message || 'An unexpected error occurred during submission' }
  }

  redirect(`/${lang}/courses/${courseId}`)
}

export async function deleteReview(courseCode, courseId, lang) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await connectDB()
  const userId = session.user.id || session.user.email
  await Review.findOneAndDelete({ courseCode, userId })

  // Recalculate
  const allReviews = await Review.find({ courseCode })
  const total = allReviews.length
  const avgRating = total > 0
    ? allReviews.reduce((sum, r) => {
        const score = ((r.ratingFun || 0) + (r.ratingWorkload || 0) + (r.ratingDifficulty || 0)) / 3
        return sum + score
      }, 0) / total
    : 0

  await Course.findByIdAndUpdate(courseId, {
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews: total,
  })

  redirect(`/${lang}/courses/${courseId}`)
}
