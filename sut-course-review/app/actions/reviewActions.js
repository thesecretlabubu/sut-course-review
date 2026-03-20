'use server'

import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Course from '@/models/Course'
import { auth } from '@/lib/auth'
import DOMPurify from 'isomorphic-dompurify'

export async function submitReview(courseId, formData) {
  const session = await auth()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const courseCode = formData.get('courseCode')
  const semester = formData.get('semester')
  const gradeReceived = formData.get('gradeReceived')
  const ratingFun = parseInt(formData.get('ratingFun') || '0')
  const ratingWorkload = parseInt(formData.get('ratingWorkload') || '0')
  const ratingDifficulty = parseInt(formData.get('ratingDifficulty') || '0')
  const rawComment = formData.get('comment') || ''
  const comment = DOMPurify.sanitize(rawComment)
  const isAnonymous = formData.get('isAnonymous') === 'on'
  const userId = session.user.id || session.user.email

  // Validate star ratings — must all be 1-5
  if (ratingFun < 1 || ratingWorkload < 1 || ratingDifficulty < 1) {
    throw new Error('กรุณาให้คะแนนทุกหมวด (ความสนุก, ปริมาณงาน, ความยาก)')
  }

  await connectDB()

  // 1-review-per-course-per-user guard
  const existing = await Review.findOne({ courseCode, userId })
  if (existing) {
    throw new Error('คุณได้รีวิววิชานี้ไปแล้ว')
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
  // avgRating = average of all 3 sub-scores across all reviews
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

  redirect(`/courses/${courseId}`)
}
