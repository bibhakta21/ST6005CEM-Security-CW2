import { FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link to="/">
          <div className="text-4xl font-extrabold text-gray-900">
            Nepalwears<span className="text-orange-500">.</span>
          </div>
        </Link>

        <ul className="hidden md:flex space-x-10 text-base font-medium text-gray-700">
          <li className="cursor-pointer hover:text-blue-600">Home</li>
          <li className="cursor-pointer hover:text-blue-600">Dashboard</li>
          <li className="cursor-pointer hover:text-blue-600">Products</li>
          <li className="cursor-pointer hover:text-blue-600">About</li>
          <li className="cursor-pointer hover:text-blue-600">Contact</li>
        </ul>

        <div className="hidden md:flex items-center space-x-6 text-xl text-gray-700 relative">
          <FiSearch className="cursor-pointer" />
          <div className="relative cursor-pointer">
            <FiShoppingBag />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </div>
          <FiHeart className="cursor-pointer" />
          <FiUser className="cursor-pointer" />
        </div>

        <div className="md:hidden text-3xl text-gray-700">
          <button>
            <FiMenu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-4 pb-4 space-y-4 text-base text-gray-700 font-medium">
        <ul className="space-y-3">
          <li className="hover:text-blue-600">Home</li>
          <li className="hover:text-blue-600">Dashboard</li>
          <li className="hover:text-blue-600">Products</li>
          <li className="hover:text-blue-600">About</li>
          <li className="hover:text-blue-600">Contact</li>
        </ul>
        <div className="flex space-x-6 mt-3 text-xl">
          <FiSearch className="cursor-pointer" />
          <FiShoppingBag className="cursor-pointer" />
          <FiHeart className="cursor-pointer" />
          <FiUser className="cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
