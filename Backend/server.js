import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import producerRoutes from "./Routes/Producer.route.js";
import CarModelRouter from "./Routes/CarModel.route.js";
import CarPartsRouter from "./Routes/CarParts.route.js";
import userRoutes from "./Routes/User.route.js";
import rolesRoutes from "./Routes/Roles.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Basic test route
app.get("/", (req, res) => {
  res.send("L'Afiray.ma Server is running!");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/producers", producerRoutes);
app.use("/api/models", CarModelRouter);
app.use("/api/carparts", CarPartsRouter);

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
