import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/lafiray'
export const connectDB = async() => {
     try{
          if (!process.env.DB_URI) {
               console.log("No DB_URI found in environment, using default localhost connection")
          }
          await mongoose.connect(DB_URI)
          console.log("Database connected successfully")
     }catch(error) {
          console.error("Database connection failed:", error.message)
          throw error
     }
}

