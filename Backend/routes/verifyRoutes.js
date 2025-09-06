import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { verifySchema } from "../validators/verifyValidator.js";
import { upload } from "../middleware/upload.js";
import { runAIMock } from "../services/aiMock.js";
import VerificationRequest from "../models/VerificationRequest.js";
import { createAuditLog } from "../services/auditService.js";

const router = express.Router();

// Multi-country rules
const countryRules = {
  IN: { docs: ["aadhaar", "passport"] },
  AU: { docs: ["passport", "driver_license"] },
  UK: { docs: ["passport", "ni_card"] }
};

// Upload document & run AI mock
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { country, documentType } = verifySchema.parse(req.body);

    // Validate country support
    if (!countryRules[country]) {
      return res.status(400).json({ error: `Country '${country}' is not supported` });
    }

    // Validate document type for that country
    if (!countryRules[country].docs.includes(documentType)) {
      return res.status(400).json({
        error: `Document type '${documentType}' is not valid for country ${country}`
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Document file is required" });
    }

    // Run AI mock
    const aiResult = await runAIMock();

    // Save verification request
    const verification = await VerificationRequest.create({
      user: req.user.id,
      country,
      documentType,
      // filePath: req.file.path,
      filePath: req.file.path.replace(/\\/g, "/").replace(/^.*uploads[\\/]/, "uploads/"), 
      aiResult,
      status: "pending_manual"
    });

    // Log audit
    await createAuditLog(
      req.user.id,
      "DOC_UPLOAD",
      verification._id,
      "VerificationRequest",
      { aiResult }
    );

    res.json({
      message: "Verification request submitted",
      id: verification._id,
      aiResult
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get verification status
router.get("/status/:id", authMiddleware, async (req, res) => {
  try {
    const verification = await VerificationRequest.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({
      status: verification.status,
      aiResult: verification.aiResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const requests = await VerificationRequest.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    if (!requests.length) {
      return res.json({ status: "No requests yet" });
    }

  res.json(
  requests.map(reqItem => ({
    status: reqItem.status,
    country: reqItem.country,
    documentType: reqItem.documentType,
    aiResult: reqItem.aiResult,
    documentPath: reqItem.filePath , 
    id: reqItem._id,
    createdAt: reqItem.createdAt
  }))
);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
