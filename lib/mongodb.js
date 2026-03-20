import mongoose from 'mongoose'

let cached = global._mongooseCache || (global._mongooseCache = { conn: null, promise: null })

export async function connectDB() {
  if (cached.conn) return cached.conn

  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not set')

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then(m => m)
  }

  cached.conn = await cached.promise
  return cached.conn
}
