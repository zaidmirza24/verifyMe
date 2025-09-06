import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import VerificationRequest from "../models/VerificationRequest.js";
import { createAuditLog } from "../services/auditService.js";
import path from "path"

const router = express.Router();

// Get all pending verifications
router.get("/pending", authMiddleware, roleMiddleware("inspector", "admin"), async (req, res) => {
  try {
    const pendingRequests = await VerificationRequest.find({ status: "pending_manual" })
      .populate("user", "email role")
      .sort({ createdAt: -1 }).lean();
      
      const result = pendingRequests.map((r) => {
       // 👈 convert mongoose doc to plain object
      return {
        ...r, 
        documentUrl: `http://localhost:4000/uploads/${path.basename(r.filePath)}`,
      };
    });

    res.json(result);
    // console.log(result)
  } catch (err) {
    console.error("Error in /pending:", err)
    res.status(500).json({ error: "Server error" });
  }
});

// Approve or reject a verification
router.post("/:id/decision", authMiddleware, roleMiddleware("inspector", "admin"), async (req, res) => {
  try {
    const { decision } = req.body; // 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ error: "Decision must be approved or rejected" });
    }

    const verification = await VerificationRequest.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ error: "Verification request not found" });
    }

    verification.status = decision;
    await verification.save();
    await createAuditLog(req.user.id, `VERIFICATION_${decision.toUpperCase()}`, verification._id, "VerificationRequest");


    res.json({ message: `Verification ${decision}`, verification });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
