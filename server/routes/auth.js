// routes/auth.js
import express from "express";
import { admin, db } from "../firebase.js"; // Firebase Admin SDK & Firestore

const router = express.Router();

// Middleware to verify Firebase ID token
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
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Sync user after login/register
router.post("/sync", verifyToken, async (req, res) => {
  try {
    const { uid, email, name: decodedName } = req.user;
    const { username } = req.body; // optional username sent from frontend

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update existing user
      await userRef.update({
        name: decodedName || username || userDoc.data().name || "",
        updatedAt: new Date(),
      });
    } else {
      // Create new user
      await userRef.set({
        uid,
        email,
        name: decodedName || username || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.json({ message: "User synced successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to sync user", error: err.message });
  }
});

export { router as authRoutes, verifyToken };
