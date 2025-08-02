import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const backendURL = "https://localhost:3000";

const ProductCard = ({ product, isBookmarked, onToggleBookmark, onAddToCart }) => {
  const navigate = useNavigate();

  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith("/")
      ? `${backendURL}${product.images[0]}`
      : product.images[0]
    : "";

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="w-full max-w-xs bg-white border rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
    <div className="relative">
  <img
    src={imageUrl}
    alt={product.shortName}
    className="rounded-lg mx-auto w-[180px] h-[220px] object-cover"
  />

        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-black hover:bg-gray-800 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110"
          >
            <FaCartPlus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(product._id);
            }}
            className={`p-2 rounded-full shadow-md hover:scale-110 transition-all ${
              isBookmarked ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            <FaHeart size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{product.shortName}</h3>
        <div className="text-yellow-400 text-sm">{"★".repeat(product.rating || 4)}</div>
        <div className="text-base font-medium">
          <span className="text-gray-400 line-through mr-2">
            Rs. {product.price.toFixed(2)}
          </span>
          <span className="text-black font-semibold">
            Rs. {(product.discountPrice || product.price).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Latest = () => {
  const { user, setCartCount } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/products`);
        setProducts(res.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
      }
    };

    const fetchBookmarks = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${backendURL}/api/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids = new Set(res.data.map((p) => p._id));
        setBookmarkedIds(ids);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err.message);
      }
    };

    fetchProducts();
    fetchBookmarks();
  }, [user]);

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

  const toggleBookmark = async (productId) => {
    if (!user) {
      toast.error("Please login to bookmark");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      const res = await axios.post(
        `${backendURL}/api/bookmarks/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message === "Product bookmarked") {
        setBookmarkedIds((prev) => new Set(prev).add(productId));
        toast.success("Added to favorites");
      } else if (res.data.message === "Bookmark removed") {
        const newSet = new Set(bookmarkedIds);
        newSet.delete(productId);
        setBookmarkedIds(newSet);
        toast.success("Removed from favorites");
      }
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please login to buy");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const primaryImageUrl = product.images?.[0] || "";

    try {
      await axios.post(
        `${backendURL}/api/bookings`,
        {
          productId: product._id,
          quantity: 1,
          productImage: primaryImageUrl,
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
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-[#f9f9f9]">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Our Latest Collection</h2>
        <p className="text-gray-500 text-base">Carefully crafted styles curated for you</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto justify-items-center">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isBookmarked={bookmarkedIds.has(product._id)}
            onToggleBookmark={toggleBookmark}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default Latest;
