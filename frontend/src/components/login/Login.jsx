import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { default as Nepalwear } from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center bg-white font-[Poppins] px-4 md:px-6 pt-16 md:pt-20 gap-0">
      {/* Left Section */}
      <div className="w-full md:w-[45%] p-3 bg-gradient-to-br from-[#0569d7] to-[#022788] flex flex-col items-center justify-start rounded-2xl md:rounded-lg shadow-lg self-start">
        <h1 className="text-white text-4xl font-bold mb-4 self-start ml-4">
          NepalWear
        </h1>
        <img
          src={Nepalwear}
          alt="watch"
          className="max-w-xs w-full object-contain"
        />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[50%] p-3 md:pl-1 flex flex-col items-center justify-center self-start">
        <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">
          Login to your Account
        </h2>
        <p className="text-gray-500 text-center mb-6">Welcome back!</p>

        {error && (
          <p className="text-sm text-red-500 text-center mb-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 text-center mb-2">{success}</p>
        )}

        <form className="w-full max-w-sm space-y-4">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <FiMail size={20} />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <FiLock size={20} />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgotpass"
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Don’t Have An Account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
