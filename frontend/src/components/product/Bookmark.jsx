import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

const backendURL = "https://localhost:3000";

// Product Card Component
const ProductCard = ({ product, onToggleBookmark, onAddToCart }) => {
  const navigate = useNavigate();

  const defaultImage = product.images?.[0]
    ? product.images[0].startsWith("/")
      ? `${backendURL}${product.images[0]}`
      : product.images[0]
    : "";

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-xl p-4 relative shadow-md hover:shadow-lg transition duration-300 w-full max-w-[260px] cursor-pointer"
    >
      <div className="relative">
        <img
          src={defaultImage}
          alt={product.shortName}
          className="rounded-lg mx-auto w-[180px] h-[220px] object-cover"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-black text-white p-2 rounded-full hover:scale-110 transition"
          >
            <FaCartPlus />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(product._id);
            }}
            className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition"
          >
            <FaHeart />
          </button>
        </div>
      </div>

      <div className="text-center mt-4 space-y-1">
        <h3 className="text-base font-semibold text-gray-800">{product.shortName}</h3>
        <div className="text-yellow-400 text-sm">
          {"★".repeat(product.rating || 4)}
        </div>
        <div className="text-base font-medium">
          {product.discountPrice ? (
            <>
              <span className="line-through text-gray-400 mr-2">
                Rs {product.price}
              </span>
              <span className="text-black font-bold">
                Rs {product.discountPrice}
              </span>
            </>
          ) : (
            <span className="text-black font-bold">Rs {product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Bookmark Page
const Bookmark = () => {
  const [bookmarkedProducts, setBookmarkedProducts] = useState([]);
  const { setCartCount } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarkedProducts(res.data);
    } catch (err) {
      toast.error("Failed to load bookmarks");
    }
  };

  const handleToggleBookmark = async (productId) => {
    try {
      const res = await axios.post(
        `${backendURL}/api/bookmarks/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Bookmark updated");
      fetchBookmarks();
    } catch (err) {
      toast.error("Failed to update bookmark");
    }
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      toast.error("Please login to buy");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      await axios.post(
        `${backendURL}/api/bookings`,
        {
          productId: product._id,
          quantity: 1,
          productImage: product.images?.[0] || "",
          productShortName: product.shortName,
          price: product.discountPrice || product.price,
          addressOne: null,
          country: null,
          number: null,
          paymentType: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Added to cart");
      fetchCartCount();
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unconfirmed = res.data.filter((item) => !item.addressOne);
      setCartCount(unconfirmed.length);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-10 bg-white min-h-screen font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Bookmarks</h2>
        {bookmarkedProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No items in your bookmark list.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {bookmarkedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onToggleBookmark={handleToggleBookmark}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bookmark;
