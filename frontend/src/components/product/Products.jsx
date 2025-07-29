import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaCartPlus, FaHeart, FaFilter, FaTshirt, FaTags } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const backendURL = "http://localhost:3000";

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
      className="bg-white rounded-xl p-4 relative shadow-sm hover:shadow-md transition w-full max-w-xs cursor-pointer border"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.shortName}
          className="rounded-lg mx-auto w-[180px] h-[220px] object-cover"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-black text-white p-2 rounded-full hover:scale-105 transition"
          >
            <FaCartPlus />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(product._id);
            }}
            className={`p-2 rounded-full hover:scale-105 transition ${
              isBookmarked ? "bg-red-500 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            <FaHeart />
          </button>
        </div>
      </div>
      <div className="text-center mt-4">
        <h3 className="text-base font-semibold mb-1">{product.shortName}</h3>
        <div className="text-yellow-400 text-sm mb-1">{"★".repeat(product.rating || 4)}</div>
        <div className="text-base font-medium">
          {product.discountPrice ? (
            <>
              <span className="line-through text-gray-400 mr-2">Rs {product.price}</span>
              <span className="text-black font-bold">Rs {product.discountPrice}</span>
            </>
          ) : (
            <span className="text-black font-bold">Rs {product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [selectedType, setSelectedType] = useState("All");
  const [stockFilter, setStockFilter] = useState(false);
  const [priceRange, setPriceRange] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${backendURL}/api/products`);
      setProducts(res.data);

      const max = Math.max(...res.data.map((p) => p.discountPrice || p.price));
      setMaxPrice(max);
      setPriceRange(max);

      if (!user) return;
      const bookmarkRes = await axios.get(`${backendURL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarkedIds(new Set(bookmarkRes.data.map((p) => p._id)));
    };
    fetchData();
  }, [user]);

  const toggleBookmark = async (productId) => {
    if (!user) {
      toast.error("Please login to bookmark");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    const res = await axios.post(`${backendURL}/api/bookmarks/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updated = new Set(bookmarkedIds);
    if (res.data.message.includes("removed")) {
      updated.delete(productId);
      toast.success("Removed from favorites");
    } else {
      updated.add(productId);
      toast.success("Added to favorites");
    }
    setBookmarkedIds(updated);
  };

 const handleAddToCart = async (product) => {
  if (!user) {
    toast.error("Please login to add items to cart");
    navigate("/login");
    return;
  }

  try {
    const payload = {
      productId: product._id,
      quantity: 1,
      productImage: product.images?.[0] || "",
      productShortName: product.shortName,
      price: product.discountPrice || product.price,
    };

    const res = await axios.post(`${backendURL}/api/bookings`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Added to cart");
  } catch (err) {
    console.error("Add to cart error:", err);
    toast.error(err.response?.data?.message || "Failed to add to cart");
  }
};


  const filtered = products.filter((p) => {
    const matchType = selectedType === "All" || p.type === selectedType;
    const matchStock = !stockFilter || p.inStock;
    const matchPrice = (p.discountPrice || p.price) <= priceRange;
    const matchSearch = p.shortName.toLowerCase().includes(searchQuery);
    return matchType && matchStock && matchPrice && matchSearch;
  });

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <aside className="space-y-6 border-r pr-4">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <FaFilter /> Filters
            </h3>
            <div className="text-sm space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Gender</h4>
                {['All', 'male', 'female'].map((type) => (
                  <label key={type} className="block cursor-pointer">
                    <input
                      type="radio"
                      className="mr-2 accent-black"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-1">Availability</h4>
                <label className="block cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 accent-black"
                    checked={stockFilter}
                    onChange={() => setStockFilter(!stockFilter)}
                  />
                  In Stock Only
                </label>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Max Price</h4>
                <input
                  type="range"
                  min="100"
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(+e.target.value)}
                  className="w-full accent-black"
                />
                <div className="text-right text-sm text-gray-700 mt-1">Up to RS{priceRange}</div>
              </div>

              <button
                onClick={() => {
                  setSelectedType("All");
                  setStockFilter(false);
                  setPriceRange(maxPrice);
                }}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          <div>
            <h2 className="text-2xl font-bold mb-6">Browse Clothing</h2>
            {filtered.length === 0 ? (
              <p className="text-gray-500">No clothing items match your criteria.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isBookmarked={bookmarkedIds.has(product._id)}
                    onToggleBookmark={toggleBookmark}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
