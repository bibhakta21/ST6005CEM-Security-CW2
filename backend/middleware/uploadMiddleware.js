const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File type check
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG, and GIF are allowed"));
  }
};


const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
}).single("avatar");

// Optional: product images or multi-upload (set own limits if needed)
const uploadImages = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Optional: limit each file to 2MB
  fileFilter,
}).fields([{ name: "images", maxCount: 20 }]);

module.exports = { avatarUpload, uploadImages };
