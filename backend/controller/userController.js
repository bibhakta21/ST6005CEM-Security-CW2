const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const verifyCaptcha = require("../middleware/verifyCaptcha");
const multer = require("multer");
const path = require("path");
const { encrypt, decrypt } = require("../middleware/aesUtil");


function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
}

exports.registerUser = async (req, res) => {
  const { username, email, password, captchaToken } = req.body;

  if (!await verifyCaptcha(captchaToken))
    return res.status(400).json({ error: "CAPTCHA failed" });

  if (await User.findOne({ email }))
    return res.status(400).json({ error: "Email in use" });

  const verifyToken = crypto.randomBytes(20).toString("hex");
  const encryptedToken = encrypt(verifyToken); 

  const secret = speakeasy.generateSecret({ name: `NepalWears (${email})` }); 

  const newUser = await new User({
    username,
    email,
    password,
    mfaEnabled: true,
    mfaSecret: secret.base32, 
    emailVerifyToken: crypto.createHash("sha256").update(verifyToken).digest("hex")
  }).save();

  const verifyURL = `${req.protocol}://${req.get("host")}/api/users/verify-email/${encodeURIComponent(encryptedToken)}`;
  await sendEmail(email, "Verify your account", `Click to verify: ${verifyURL}`);

  res.status(201).json({ message: "Registered. Check email to verify." });
};



exports.verifyEmail = async (req, res) => {
  try {
    const encrypted = decodeURIComponent(req.params.token);
    const decryptedToken = decrypt(encrypted);

    const hashedToken = crypto.createHash("sha256").update(decryptedToken).digest("hex");
    const user = await User.findOne({ emailVerifyToken: hashedToken });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    await user.save();

    res.redirect("http://localhost:5173/register-success");
  } catch (error) {
    console.error("[EMAIL VERIFY ERROR]", error.message);
    res.status(400).json({ error: "Invalid or tampered token" });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  //  Verify CAPTCHA
  if (!await verifyCaptcha(captchaToken))
    return res.status(400).json({ error: "CAPTCHA failed" });

  //  Check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  //  Check for account lock
  if (user.isLocked) return res.status(403).json({ error: "Account locked" });

  //  Validate password
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    await user.incLoginAttempts();
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Reset login attempts after successful login
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  // Ensure email is verified
  if (!user.emailVerified) return res.status(403).json({ error: "Email not verified" });

  // Check for password expiration
  if (user.passwordExpiresAt && user.passwordExpiresAt < Date.now()) {
    return res.status(403).json({ error: "Your password has expired. Please reset it." });
  }

  // MFA Step
  if (user.mfaEnabled) {
    const otp = speakeasy.totp({
      secret: user.mfaSecret,
      encoding: "base32",
    });

    await sendEmail(
      user.email,
      "Your OTP Code for Login",
      `Your one-time password (OTP) is: ${otp}. It will expire in 5 minutes.`
    );

    return res.json({ mfaRequired: true, userId: user._id });
  }

  //  Issue JWT token
  const token = signToken(user._id);

  //Create session 
  req.session.userId = user._id;

  res.json({ token });
};


exports.setupMfa = async (req, res) => {
  const user = await User.findById(req.user.id);
  const secret = speakeasy.generateSecret({ name: "NepalWears(" + user.email + ")" });
  user.mfaSecret = secret.base32;
  await user.save();

  const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
  res.json({ qr: qrDataUrl });
};


exports.verifyMfa = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !user.mfaSecret) {
      console.log("[ERROR] MFA not setup for user:", user?.email);
      return res.status(400).json({ error: "MFA not setup" });
    }

    console.log("[DEBUG] Verifying OTP:", token, "for:", user.email);

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: token.trim(),
      window: 10,
    });

    console.log("[DEBUG] OTP Verified:", verified);

    if (!verified) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.mfaEnabled = true;
    await user.save();

    const jwtToken = signToken(user._id);
    res.json({ token: jwtToken });
  } catch (error) {
    console.error("[MFA ERROR]", error);
    res.status(500).json({ error: "Server error during MFA verification" });
  }
};

exports.disableMfa = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.mfaEnabled = false; user.mfaSecret = undefined;
  await user.save();
  res.json({ message: "MFA disabled" });
};


// Get all users (Admin)
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Get user by ID (Admin)
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// Get current user details
exports.getUserByMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude the password field
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const avatar = req.file?.filename;

    const updates = { username, email };
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ success: "Profile updated successfully!", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// Create user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists. Please choose another." });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already in use. Please use a different email." });
    }



    // Create new user
    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ success: "User created successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    for (const old of user.previousPasswords || []) {
      const reused = await bcrypt.compare(newPassword, old);
      if (reused) return res.status(400).json({ error: "You cannot reuse a previous password." });
    }

    user.previousPasswords = user.previousPasswords || [];
    user.previousPasswords.unshift(user.password);
    if (user.previousPasswords.length > 5) {
      user.previousPasswords = user.previousPasswords.slice(0, 5);
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    user.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    await user.save();
    res.json({ success: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email does not exist" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You have requested to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nThis link is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: "Check your Gmail. Reset link has been sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    for (const old of user.previousPasswords || []) {
      const reused = await bcrypt.compare(newPassword, old);
      if (reused) return res.status(400).json({ error: "Cannot reuse a previous password." });
    }

    user.previousPasswords = user.previousPasswords || [];
    user.previousPasswords.unshift(user.password);
    if (user.previousPasswords.length > 5) {
      user.previousPasswords = user.previousPasswords.slice(0, 5);
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    user.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.json({ message: "Password reset successfully! Please log in again." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




