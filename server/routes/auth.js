// routes/auth.js
import express from "express";
import { admin, db } from "../firebase.js"; // Firebase Admin SDK & Firestore

const router = express.Router();

// 🔹 Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// 🔹 Sync user after login/register
router.post("/sync", verifyToken, async (req, res) => {
  try {
    const { uid, email, name: decodedName } = req.user;
    const { username } = req.body; // optional username sent from frontend

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const now = new Date();

    if (userDoc.exists) {
      // Update existing user: track last login and optionally update name
      const currentData = userDoc.data();
      const updatedName = decodedName || username || currentData.name || "";

      await userRef.update({
        name: updatedName,
        updatedAt: now,
        lastLogin: now,
        loginHistory: admin.firestore.FieldValue.arrayUnion(now), // track all login times
      });

      console.log(`User ${uid} login updated at ${now.toISOString()}`);
    } else {
      // Create new user
      await userRef.set({
        uid,
        email,
        name: decodedName || username || "",
        createdAt: now,
        updatedAt: now,
        lastLogin: now,
        loginHistory: [now], // first login
      });

      console.log(`New user ${uid} created at ${now.toISOString()}`);
    }

    res.json({ message: "User synced successfully", uid });
  } catch (err) {
    console.error("User sync failed:", err);
    res.status(500).json({ message: "Failed to sync user", error: err.message });
  }
});

export { router as authRoutes, verifyToken };
