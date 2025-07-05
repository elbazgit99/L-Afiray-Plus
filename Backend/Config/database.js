import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const DB_URI = process.env.DB_URI 
export const connectDB = async() => {
     try{
          await mongoose.connect(DB_URI)
          console.log("Database connected successfully")
     }catch(error) {
          console.error("Database connection failed:", error.message)
          process.exit(1)
     }
}

