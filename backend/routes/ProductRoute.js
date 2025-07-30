const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  updateReview,
  deleteReview,
} = require("../controller/ProductController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const { uploadImages } = require("../middleware/uploadMiddleware");


const router = express.Router();

// Product routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminMiddleware, uploadImages, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, uploadImages, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

// review route
router.post("/:id/reviews", authMiddleware, addReview);
router.put("/:id/reviews", authMiddleware, updateReview);
router.delete("/:id/reviews/:reviewId", authMiddleware, deleteReview);

module.exports = router;
