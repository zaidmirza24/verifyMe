import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signupSchema, loginSchema } from "../validators/authValidator.js";
import { createAuditLog } from "../services/auditService.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash, role: role || "user" });
    await newUser.save();
    
    // After saving newUser:
    await createAuditLog(newUser._id, "USER_SIGNUP", newUser._id, "User", { role: newUser.role });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    if (err.errors) return res.status(400).json({ error: err.errors.map(e => e.message) });
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, role: user.role });
  } catch (err) {
    if (err.errors) return res.status(400).json({ error: err.errors.map(e => e.message) });
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
