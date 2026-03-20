import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema({
  reviewId: String,
  courseCode: String,
  reason: String,           // 'inappropriate' | 'spam' | 'misleading' | 'other'
  detail: String,           // optional extra detail
  reportedAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
})

export default mongoose.models.Report || mongoose.model('Report', ReportSchema)
