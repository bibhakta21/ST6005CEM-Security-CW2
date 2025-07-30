const express = require("express");
const router = express.Router();
const csrf = require("csurf"); // ✅ added
const csrfProtection = csrf({ cookie: true }); // ✅ cookie-based

const {
  registerUser,
  loginUser,
  verifyEmail,
  setupMfa,
  verifyMfa,
  disableMfa,
  getUserByMe,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUser,
  createUser,
} = require("../controller/userController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { loginRateLimiter } = require("../middleware/rateLimitMiddleware");
const { avatarUpload } = require("../middleware/uploadMiddleware");
const ActivityLog = require("../model/ActivityLog");

// Public Routes
router.post("/signup", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", csrfProtection, loginRateLimiter, loginUser);

router.post("/verify-mfa", verifyMfa);
router.put("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Authenticated Routes
router.get("/me", authMiddleware, getUserByMe);
router.put("/me", authMiddleware, avatarUpload, updateUser);
router.post("/setup-mfa", authMiddleware, setupMfa);
router.post("/disable-mfa", authMiddleware, disableMfa);

// Admin Routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.post("/", authMiddleware, adminMiddleware, createUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/activity-logs", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate("user", "username email").sort({ timestamp: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

module.exports = router;
