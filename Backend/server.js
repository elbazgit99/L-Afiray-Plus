import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cors from "cors";

import producerRoutes from "./Routes/Producer.route.js";
import carModelRoutes from "./Routes/CarModel.route.js";
import CarPartsRouter from "./Routes/CarParts.route.js";
import userRoutes from "./Routes/User.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse json
app.use(express.json());
app.use(cors());

// Basic test route
app.get("/", (req, res) => {
     res.send("Server is running!");
});
//API Routes
app.use("/api/producers", producerRoutes);
app.use("/api/models", carModelRoutes);
app.use("/api/carparts", CarPartsRouter);
app.use("/api/users", userRoutes);

// Connect to DB and start server
await connectDB()
     .then(() => {
          app.listen(PORT, () => {
               console.log(`Server running on port ${PORT}`);
          });
     })
     .catch((error) => {
          console.error("Failed to connect to DB", error);
     });