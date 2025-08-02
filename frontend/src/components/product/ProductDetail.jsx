import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const backendURL = "https://localhost:3000";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(UserContext);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/products/${id}`);
      setProduct(res.data);
      const firstImg = res.data.images[0];
      setSelectedImage(firstImg.startsWith("/") ? `${backendURL}${firstImg}` : firstImg);
    } catch {
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) return navigate("/login");

  try {
    await axios.post(
      `${backendURL}/api/bookings`,
      {
        productId: product._id,
        quantity,
        productImage: product.images[0],
        productShortName: product.shortName,
        price: product.discountPrice || product.price,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Product added to cart");
    if (fetchCartCount) await fetchCartCount(token);
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to add to cart";
    toast.error(message);
  }
};


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to rate or review");
    if (!rating && !comment.trim()) return toast.error("Rating or comment required");

    try {
      if (editingReviewId) {
        // Update review
        await axios.put(
          `${backendURL}/api/products/${id}/reviews`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Review updated");
      } else {
        // Create new review
        await axios.post(
          `${backendURL}/api/products/${id}/reviews`,
          { rating, comment },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Review submitted");
      }

      setComment("");
      setRating(5);
      setEditingReviewId(null);
      fetchProduct();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Review failed");
    }
  };

  const handleEditReview = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review._id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${backendURL}/api/products/${id}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      fetchProduct();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-12">
      <Toaster position="top-right" />

      {/* Breadcrumb aligned top left */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="text-sm text-gray-600">
          <Link to="/" className="hover:underline text-blue-600">Home</Link> /{" "}
          <Link to="/product" className="hover:underline text-blue-600">Products</Link> /{" "}
          <span className="text-black">{product.fullName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border rounded-xl overflow-hidden shadow w-full h-[400px]">
            <img src={selectedImage} alt="Product" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-3 justify-center">
            {product.images.slice(0, 3).map((img, idx) => {
              const full = img.startsWith("/") ? `${backendURL}${img}` : img;
              return (
                <img
                  key={idx}
                  src={full}
                  onClick={() => setSelectedImage(full)}
                  className={`w-20 h-20 border rounded-lg cursor-pointer object-cover hover:scale-105 transition ${
                    selectedImage === full ? "border-black" : "border-gray-300"
                  }`}
                  alt={`thumb-${idx}`}
                />
              );
            })}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.fullName}</h1>
          <p className="text-gray-600 text-sm">Category: {product.type}</p>

          <div className="flex items-center gap-4 text-lg">
            <span className="line-through text-gray-400">Rs {product.price}</span>
            <span className="font-bold text-black text-2xl">Rs {product.discountPrice || product.price}</span>
            <span className="text-yellow-500 font-medium text-base">★ {product.rating || 5}</span>
          </div>

          <p className="text-sm leading-relaxed text-gray-700 text-justify">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm">Quantity:</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg font-bold bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <div className="px-4 py-1 text-lg">{quantity}</div>
              <button
                onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                className="px-3 py-1 text-lg font-bold bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition mt-3 text-base"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Customer Reviews</h2>

        <div className="space-y-6 mb-10">
          {product.reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

          {product.reviews.map((r) => (
            <div key={r._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-sm text-black">{r.username}</p>
                <p className="text-yellow-500 text-sm">★ {r.rating}</p>
              </div>
              <p className="text-gray-700 text-sm">{r.comment}</p>
              {(user?.id === r.user || user?.role === "admin") && (
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleEditReview(r)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="space-y-4 border-t pt-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className={`text-2xl transition ${s <= rating ? "text-yellow-500" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full border rounded px-3 py-2"
              placeholder="Write your thoughts..."
            />
            <button
              type="submit"
              className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition text-base"
            >
              {editingReviewId ? "Update Review" : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-red-500 mt-4">Please login to rate or review.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
