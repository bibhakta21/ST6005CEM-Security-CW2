const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  emailVerified: { type: Boolean, default: false },
  emailVerifyToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  passwordChangedAt: Date,
  passwordExpiresAt: Date,
  previousPasswords: [{ type: String }],
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  mfaSecret: String,
  mfaEnabled: { type: Boolean, default: false }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  this.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
  next();
});

UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.methods.incLoginAttempts = function () {
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 15 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 };
  }
  return this.updateOne(updates);
};

module.exports = mongoose.model("User", UserSchema);
