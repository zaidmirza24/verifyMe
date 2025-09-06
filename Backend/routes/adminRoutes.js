import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";

const router = express.Router();

// Get all audit logs
router.get("/audit", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "email role")
      .sort({ createdAt: -1 })
      .limit(50); // limit for now
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users
router.get("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
