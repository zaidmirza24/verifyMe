import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "inspector", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
