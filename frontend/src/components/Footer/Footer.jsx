import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo1.png"; // Adjust this path as needed

const Footer = () => {
  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-y-12 gap-x-16">
        {/* Brand & Testimonial */}
        <div>
          <img
            src={logo}
            alt="Samaya Logo"
            className="w-40 h-auto object-contain"
          />
          <p className="mt-4 text-sm leading-relaxed text-[#8b8e99]">
         Don’t waste time, just order! This is the best website to purchase
            clothes. Best e-commerce site in Nepal. 
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="#"
              className="bg-[#1d4ed8] w-8 h-8 flex items-center justify-center rounded-full"
            >
              <FaFacebookF className="text-white text-base" />
            </a>
            <a
              href="#"
              className="bg-[#1d4ed8] w-8 h-8 flex items-center justify-center rounded-full"
            >
              <FaTwitter className="text-white text-base" />
            </a>
            <a
              href="#"
              className="bg-[#1d4ed8] w-8 h-8 flex items-center justify-center rounded-full"
            >
              <FaInstagram className="text-white text-base" />
            </a>
            <a
              href="#"
              className="bg-[#1d4ed8] w-8 h-8 flex items-center justify-center rounded-full"
            >
              <FaYoutube className="text-white text-base" />
            </a>
          </div>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <p className="text-sm text-[#8b8e99]">Kalanki, Kathmandu</p>
          <p className="text-sm mt-2 text-[#8b8e99]">samaya@info.com</p>
          <p className="text-sm mt-2 text-[#8b8e99]">+977-9813056161</p>
          <Link to="/faq">
            <p className="text-sm mt-2 text-[#8b8e99] hover:text-orange-400 transition">
              Frequently Asked Questions
            </p>
          </Link>
        </div>

       
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm text-[#8b8e99]">
            <li>
              <Link to="/" className="hover:text-orange-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-orange-400">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-400">
                Contacts
              </Link>
            </li>
          </ul>
        </div>

      
      </div>

    
    </div>
  );
};

export default Footer;
