// routes/poll.js
import express from "express";
import { admin } from "../firebase.js"; // initialized Firebase Admin SDK
import { verifyToken } from "./auth.js";

const router = express.Router();
const db = admin.firestore();

// ✅ Create a new poll (only logged-in users)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, options } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Title and at least 2 options are required" });
    }

    const formattedOptions = options.map(opt => ({
      text: opt,
      votes: 0,
      votedBy: [], // track user IDs who voted
    }));

    const pollRef = await db.collection("polls").add({
      title,
      options: formattedOptions,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ id: pollRef.id, message: "Poll created successfully!" });
  } catch (err) {
    console.error("Error creating poll:", err);
    res.status(500).json({ message: "Failed to create poll", error: err.message });
  }
});

// ✅ Get all polls
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("polls").orderBy("createdAt", "desc").get();
    const polls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(polls);
  } catch (err) {
    console.error("Error fetching polls:", err);
    res.status(500).json({ message: "Failed to fetch polls", error: err.message });
  }
});

// ✅ Vote on a poll
router.post("/:id/vote", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;

    if (!option) return res.status(400).json({ message: "Option is required" });

    const pollRef = db.collection("polls").doc(id);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) return res.status(404).json({ message: "Poll not found" });

    const poll = pollDoc.data();

    // Check if user already voted
    const alreadyVoted = poll.options.some(opt => (opt.votedBy || []).includes(req.user.uid));
    if (alreadyVoted) {
      return res.status(400).json({ message: "You have already voted in this poll" });
    }

    // Increment vote for the selected option and store voter
    const updatedOptions = poll.options.map(opt => {
      if (opt.text === option) {
        return {
          ...opt,
          votes: (opt.votes || 0) + 1,
          votedBy: [...(opt.votedBy || []), req.user.uid],
          lastVotedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
      }
      return opt;
    });

    await pollRef.update({ options: updatedOptions });

    res.json({ message: "Vote submitted successfully!" });
  } catch (err) {
    console.error("Error voting on poll:", err);
    res.status(500).json({ message: "Failed to submit vote", error: err.message });
  }
});

export { router as pollRoutes };
