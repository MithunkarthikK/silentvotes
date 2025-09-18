// server/firebase.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let serviceAccount;

// ✅ Use environment variable in production, fallback to local file in development
if (process.env.NODE_ENV === "production") {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT environment variable is missing!");
    process.exit(1);
  }
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error("❌ Invalid FIREBASE_SERVICE_ACCOUNT JSON:", err.message);
    process.exit(1);
  }
} else {
  // Local development: read keys.json
  const serviceAccountPath = process.env.FIREBASE_KEY_PATH || path.resolve("./keys.json");
  if (!fs.existsSync(serviceAccountPath)) {
    console.error(`❌ Local keys.json not found at ${serviceAccountPath}`);
    process.exit(1);
  }
  try {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } catch (err) {
    console.error("❌ Failed to read local Firebase service account key:", err.message);
    process.exit(1);
  }
}

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined, // optional Realtime DB
    });
    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.error("❌ Firebase Admin initialization failed:", err.message);
    process.exit(1);
  }
}

// Firestore reference
const db = admin.firestore();

export { admin, db };
