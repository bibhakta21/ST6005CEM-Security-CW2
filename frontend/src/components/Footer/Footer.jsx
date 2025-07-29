import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-white text-gray-900 shadow-[0_-6px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-y-12 gap-x-16">
        
        {/* Brand & Testimonial */}
        <div>
          <Link to="/">
            <div className="text-4xl font-extrabold text-gray-900">
              NepalWears<span className="text-orange-500">.</span>
            </div>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Don’t waste time, just order! This is the best website to purchase
            clothes. Best e-commerce site in Nepal.
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="#"
              className="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-700 transition"
            >
              <FaFacebookF className="text-white text-base" />
            </a>
            <a
              href="#"
              className="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-700 transition"
            >
              <FaTwitter className="text-white text-base" />
            </a>
            <a
              href="#"
              className="bg-pink-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-600 transition"
            >
              <FaInstagram className="text-white text-base" />
            </a>
            <a
              href="#"
              className="bg-red-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-700 transition"
            >
              <FaYoutube className="text-white text-base" />
            </a>
          </div>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <p className="text-sm text-gray-600">Kalanki, Kathmandu</p>
          <p className="text-sm mt-2 text-gray-600">nepalwears@info.com</p>
          <p className="text-sm mt-2 text-gray-600">+977-9813056161</p>
          <Link to="/faq">
            <p className="text-sm mt-2 text-gray-600 hover:text-orange-500 transition">
              Frequently Asked Questions
            </p>
          </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-orange-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-orange-500 transition">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-500 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-500 transition">
                Contacts
              </Link>
            </li>
          </ul>
        </div>

        {/* Google Map */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Google Maps</h2>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.207617926562!2d85.28493277462759!3d27.70895527619113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198ed174aef5%3A0x37c163c2ea2e267b!2sKalanki!5e0!3m2!1sen!2snp!4v1688229345211!5m2!1sen!2snp"
            width="100%"
            height="150"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        Copyright © 2025 | NepalWears
      </div>
    </div>
  );
};

export default Footer;
