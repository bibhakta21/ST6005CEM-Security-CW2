const mongoose = require("mongoose");

// Review subdocument
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String },
  rating: { type: Number, min: 1, max: 5 }, // not required anymore
  comment: { type: String }, // not required anymore
  createdAt: { type: Date, default: Date.now }
});


const ProductSchema = new mongoose.Schema({
  shortName: { type: String, required: true },
  fullName: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  rating: { type: Number, default: 5 },
  reviews: [ReviewSchema],
  description: { type: String, required: true },
  type: { type: String, enum: ["male", "female"], required: true },
  inStock: { type: Boolean, default: true },
  images: [{ type: String, required: true }], // array of image URLs
});

module.exports = mongoose.model("Product", ProductSchema);
