import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Navbar = () => {
  const { user, logout, cartCount } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path === "/dashboard") setActiveNav("dashboard");
    else if (path === "/product") setActiveNav("product");
    else if (path === "/about") setActiveNav("about");
    else if (path === "/contact") setActiveNav("contact");
    else setActiveNav("");
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleScroll = (id) => {
    setActiveNav(id);
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link to="/">
          <div className="text-4xl font-extrabold text-gray-900">
            NepalWears<span className="text-orange-500">.</span>
          </div>
        </Link>

        <ul className="hidden md:flex space-x-10 text-base font-medium text-gray-700">
          <li
            className={`cursor-pointer ${activeNav === "home" ? "text-blue-600" : "hover:text-blue-600"}`}
            onClick={() => {
              setActiveNav("home");
              navigate("/");
            }}
          >
            Home
          </li>

          {user?.role === "admin" && (
            <li
              className={`cursor-pointer ${activeNav === "dashboard" ? "text-blue-600" : "hover:text-blue-600"}`}
              onClick={() => {
                setActiveNav("dashboard");
                navigate("/dashboard");
              }}
            >
              Dashboard
            </li>
          )}

          <li
            className={`cursor-pointer ${activeNav === "product" ? "text-blue-600" : "hover:text-blue-600"}`}
            onClick={() => {
              setActiveNav("product");
              navigate("/product");
            }}
          >
            Clothing
          </li>

          <Link to="/about">
            <li className={`cursor-pointer ${activeNav === "about" ? "text-blue-600" : "hover:text-blue-600"}`}>
              About
            </li>
          </Link>

          <Link to="/contact">
            <li className={`cursor-pointer ${activeNav === "contact" ? "text-blue-600" : "hover:text-blue-600"}`}>
              Contact
            </li>
          </Link>
        </ul>

        <div className="hidden md:flex items-center space-x-6 text-xl text-gray-700 relative">
          {searchOpen ? (
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim()) {
                    navigate(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
                    setSearchOpen(false);
                    setSearchTerm("");
                  }
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Search clothing..."
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="ml-3 text-gray-600 hover:text-red-500 text-xl"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <FiSearch onClick={() => setSearchOpen(true)} className="cursor-pointer" />
          )}

          {user ? (
            <>
              <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
                <FiShoppingBag />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>

              <FiHeart
                className="cursor-pointer"
                onClick={() => navigate("/bookmark")}
              />

              <FiUser className="cursor-pointer" onClick={() => navigate("/profile")} />
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-sm font-medium hover:text-blue-600">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="ml-2 text-sm font-medium hover:text-blue-600">
                Sign Up
              </button>
            </>
          )}
        </div>

        <div className="md:hidden text-3xl text-gray-700">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 text-base text-gray-700 font-medium">
          <ul className="space-y-3">
            <li onClick={() => { setActiveNav("home"); navigate("/"); }} className={activeNav === "home" ? "text-blue-600" : ""}>Home</li>
            {user?.role === "admin" && (
              <li onClick={() => { setActiveNav("dashboard"); navigate("/dashboard"); }} className={activeNav === "dashboard" ? "text-blue-600" : ""}>Dashboard</li>
            )}
            <li onClick={() => { setActiveNav("product"); navigate("/product"); }} className={activeNav === "product" ? "text-blue-600" : ""}>Clothing</li>
            <li onClick={() => navigate("/about")} className={activeNav === "about" ? "text-blue-600" : ""}>About</li>
            <li onClick={() => navigate("/contact")} className={activeNav === "contact" ? "text-blue-600" : ""}>Contact</li>
          </ul>
          <div className="flex space-x-6 mt-3 text-xl">
            <FiSearch onClick={() => setSearchOpen(true)} className="cursor-pointer" />
            {user ? (
              <>
                <FiShoppingBag onClick={() => navigate("/cart")} className="cursor-pointer" />
                <FiHeart onClick={() => navigate("/bookmark")} className="cursor-pointer" />
                <FiUser onClick={() => navigate("/profile")} className="cursor-pointer" />
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="text-sm font-medium hover:text-blue-600">
                  Login
                </button>
                <button onClick={() => navigate("/register")} className="ml-2 text-sm font-medium hover:text-blue-600">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
