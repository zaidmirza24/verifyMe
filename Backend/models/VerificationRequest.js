import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    country: { type: String, enum: ["IN", "AU", "UK"], required: true },
    documentType: { type: String, enum: ["aadhaar", "passport"], required: true },
    filePath: { type: String, required: true },
    aiResult: {
        status: { type: String, enum: ["valid", "invalid"] },
        confidence: Number,
        isTampered: Boolean
    },
    status: { type: String, default: "uploaded" }, // uploaded, pending_manual, approved, rejected
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("VerificationRequest", verificationSchema);
