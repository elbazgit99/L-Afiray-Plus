import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cors from "cors";

import categoryRoutes from "./Routes/Category.route.js";
import modelRoutes from "./Routes/Model.route.js";
import userRoutes from "./Routes/User.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Basic test route
app.get("/", (req, res) => {
     res.send("Server is up and running!");
});

// Use your routes
app.use("/api/categories", categoryRoutes);
app.use("/api/models", modelRoutes);
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