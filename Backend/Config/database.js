import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/l-afiray'
export const connectDB = async() => {
     try{
          if (!process.env.MONGODB_URI) {
               console.log("No MONGODB_URI found in environment, using default localhost connection")
          }
          await mongoose.connect(DB_URI)
          console.log("Database connected successfully")
     }catch(error) {
          console.error("Database connection failed:", error.message)
          throw error
     }
}

