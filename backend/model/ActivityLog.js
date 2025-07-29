const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    ip: String,
    userAgent: String,
    severity: { type: String, enum: ["info", "warn", "error"], default: "info" },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
