import { useState } from "react";
import { toast } from "react-hot-toast";
import { FiHelpCircle, FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-[Poppins] px-6 lg:px-20 py-16 flex flex-col md:flex-row gap-12">
      
      {/* Left: Contact Form */}
      <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Get in <span className="text-orange-600">Touch</span>
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Have a question or want to reach out? We’re always ready to help.
        </p>

        <form onSubmit={submitForm} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Phone"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Send Message
          </button>
        </form>

        {/* Info Row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <FiPhone className="text-orange-500" />
            <span>9813056161</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-orange-500" />
            <span>info@samaya.com</span>
          </div>
          <div className="flex items-center gap-2">
            <FiHelpCircle className="text-orange-500" />
            <Link to="/faq" className="hover:underline text-orange-600">FAQ</Link>
          </div>
        </div>
      </div>

      {/* Right: Map */}
      <div className="w-full md:w-1/2">
        <iframe
          title="NepalWears Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.387690830764!2d85.33623877531636!3d27.705102125358845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199e091c56a3%3A0x1468d146930b2c9b!2sBaba%20Oil%20Store!5e0!3m2!1sen!2snp!4v1685621302144!5m2!1sen!2snp"
          className="w-full h-96 md:h-[500px] rounded-3xl border border-gray-300 shadow-lg"
          loading="lazy"
        />
      </div>
    </div>
  );
}
