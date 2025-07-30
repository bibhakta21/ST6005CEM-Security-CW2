const jwt = require("jsonwebtoken");
const User = require("../model/User");
exports.authMiddleware = async (req, res, next) => {
  let token = req.cookies?.token;
  if (!token) {
    const auth = req.header("Authorization");
    if (auth?.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
    }
  }
  if (!token) return res.status(401).json({ error: "Token missing" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({ error: "Token expired, please log in again" });
    }
    req.user = user; next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};


exports.adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access Forbidden, Admins Only" });
  }
  next();
};
