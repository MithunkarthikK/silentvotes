// routes/auth.js
import express from "express";
import { admin, db } from "../firebase.js"; // Firebase Admin SDK & Firestore

const router = express.Router();

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Sync user after login/register
router.post("/sync", verifyToken, async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    const { username } = req.body; // username sent from frontend

    const userRef = db.collection("users").doc(uid);
    await userRef.set(
      {
        uid,
        email,
        name: name || username || "",
        updatedAt: new Date(),
      },
      { merge: true } // merge so existing fields are not overwritten
    );

    res.json({ message: "User synced successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to sync user", error: err.message });
  }
});

export { router as authRoutes, verifyToken };
