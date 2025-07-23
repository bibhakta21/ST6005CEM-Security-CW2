const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { username, email,  password, role } = req.body;

    // Check for duplicate username, email, and phone
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists. Please try another." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already in use. Please use a different email." });
    }

   

    // Check if an avatar file was uploaded
    const avatar = req.file ? `/uploads/${req.file.filename}` : "";

    // Create and save new user, including avatar if provided
    const user = new User({ username, email, password, role, avatar });
    await user.save();

    res.status(201).json({ success: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email does not exist" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, success: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare old password with stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    // Update with new password (hashed in pre-save hook)
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.json({ success: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

