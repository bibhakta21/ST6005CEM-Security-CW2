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

       

     
      </div>


     
    </nav>
  );
};

export default Navbar;
