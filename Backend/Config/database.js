import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const DB_URI = process.env.DB_URI
export const connectDB = async() => {
     try{
          await mongoose.connect(DB_URI)
          console.log("you connected succesfylly")
     }catch(err) {
          console.err("connection Failed")
          process.exit(1) //in case connection failed
     }
}