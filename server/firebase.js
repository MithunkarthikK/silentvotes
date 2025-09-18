// server/firebase.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Path to your service account key
const serviceAccountPath = process.env.FIREBASE_KEY_PATH || path.resolve("./keys.json");

let serviceAccount;

try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
} catch (err) {
  console.error("❌ Failed to read Firebase service account key:", err.message);
  process.exit(1); // stop server if Firebase cannot initialize
}

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
}

// Firestore reference
const db = admin.firestore();

export { admin, db };
