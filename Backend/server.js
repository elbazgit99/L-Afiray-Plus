import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cors from "cors";

// Import Routes
import producerRoutes from "./Routes/Producer.route.js";
import carModelRoutes from "./Routes/CarModel.route.js";
import CarPartsRouter from "./Routes/CarParts.route.js";
import userRoutes from "./Routes/User.route.js"; // This will now include auth routes too
import rolesRoutes from "./Routes/Roles.route.js"; // Included just in case you need it, though not strictly required for roles logic now.

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse json and enable CORS
app.use(express.json());
app.use(cors());

// Basic test route (can remain public)
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// API Routes
// Mount User/Auth routes first as they handle authentication
app.use("/api/users", userRoutes); // Handles /api/users/register and /api/users/login, plus protected user CRUD
app.use("/api/roles", rolesRoutes); // For roles CRUD, likely admin-only

// Other main API routes (now protected within their respective route files)
app.use("/api/producers", producerRoutes);
app.use("/api/models", carModelRoutes);
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
        process.exit(1); // Exit process if DB connection fails
    });
