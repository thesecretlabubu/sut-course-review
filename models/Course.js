import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema({
  code: String,           // รหัสวิชา เช่น IST101
  name: String,           // ชื่อวิชา
  category: String,       // หมวดหมู่
  description: String,    // คำอธิบายวิชา
  credits: { type: Number, default: 3 },
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
})

export default mongoose.models.Course || mongoose.model('Course', CourseSchema)
