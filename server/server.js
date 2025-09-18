// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit"; // Optional
import { authRoutes } from "./routes/auth.js";
import { pollRoutes } from "./routes/poll.js";

dotenv.config();

let serviceAccount;

// ✅ Use local file in development, env variable in production
if (process.env.NODE_ENV === "production") {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env variable is missing!");
  }
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local development: read keys.json
  const serviceAccountPath = path.resolve("./keys.json");
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Local keys.json not found at ${serviceAccountPath}`);
  }
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
  console.log("✅ Firebase Admin initialized");
}

export const db = admin.firestore();

const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// ✅ Optional: request logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ✅ Optional: rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// 🔹 Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "SilentVote API is running 🚀" });
});

// 🔹 Routes
app.use("/users", authRoutes);
app.use("/polls", pollRoutes);

// 🔹 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔹 Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
