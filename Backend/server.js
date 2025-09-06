import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import inspectorRoutes from "./routes/inspectorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

// CORS setup
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true
}));

// Helmet setup (important fix here!)
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(express.json());

// ✅ Serve static uploads with CORS
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/inspector", inspectorRoutes);
app.use("/api/admin", adminRoutes);

// Root
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
