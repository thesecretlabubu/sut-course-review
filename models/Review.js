import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  courseCode: String,
  userId: String,           // Google user ID (sub)
  userEmail: String,
  userName: String,
  isAnonymous: { type: Boolean, default: false },
  semester: String,         // เช่น 2/2567
  ratingFun: Number,        // 1-5
  ratingWorkload: Number,   // 1-5
  ratingDifficulty: Number, // 1-5
  gradeReceived: String,    // A, B+, B...
  comment: String,
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
