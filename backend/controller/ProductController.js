const Product = require("../model/Product");
const User = require("../model/User");

// Helper to calculate average rating
const calculateAverageRating = (reviews) => {
  const rated = reviews.filter(r => typeof r.rating === "number");
  if (!rated.length) return 5;
  const total = rated.reduce((acc, r) => acc + r.rating, 0);
  return parseFloat((total / rated.length).toFixed(1));
};


// Create Product (Clothing)
exports.createProduct = async (req, res) => {
  try {
    const {
      shortName,
      fullName,
      price,
      discountPrice,
      description,
      type,
      inStock
    } = req.body;

    const imageFiles = req.files?.images;

    if (!shortName || !fullName || !price || !description || !type || !imageFiles) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const images = Array.isArray(imageFiles)
      ? imageFiles.map(file => `/uploads/${file.filename}`)
      : [`/uploads/${imageFiles.filename}`];

    const product = new Product({
      shortName,
      fullName,
      price,
      discountPrice,
      description,
      type,
      inStock,
      images
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let updatedData = { ...req.body };

    if (req.files?.length > 0) {
      updatedData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add review
// Add review (multiple allowed per user)
exports.addReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Not authenticated" });

    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating && !comment) {
      return res.status(400).json({ error: "At least rating or comment is required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newReview = {
      user: userId,
      username: user.username,
      rating: rating ? Number(rating) : undefined,
      comment: comment || undefined,
    };

    product.reviews.push(newReview);
    product.rating = calculateAverageRating(product.reviews.filter(r => r.rating !== undefined));
    await product.save();

    res.json({
      message: "Review added",
      reviews: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Update review
exports.updateReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { rating, comment, reviewId } = req.body;
    const userId = req.user.id;

    if (!reviewId) {
      return res.status(400).json({ error: "Review ID is required for updating" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isAdmin = user.role === "admin";
    const isOwner = review.user.toString() === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to update this review" });
    }

    // Apply partial updates
    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    product.rating = calculateAverageRating(product.reviews.filter(r => r.rating !== undefined));
    await product.save();

    res.json({
      message: "Review updated",
      reviews: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Not authenticated" });

    const { id: productId, reviewId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isAdmin = user.role === "admin";
    const isOwner = review.user.toString() === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    product.reviews.pull(reviewId);
    product.rating = calculateAverageRating(product.reviews);
    await product.save();

    res.json({
      message: "Review deleted",
      reviews: product.reviews,
      rating: product.rating
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
