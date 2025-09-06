import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  target: { type: mongoose.Schema.Types.ObjectId, refPath: "targetModel" },
  targetModel: { type: String, enum: ["User", "VerificationRequest"], required: false },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", auditLogSchema);
