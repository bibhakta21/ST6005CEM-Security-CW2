import { useState } from "react";
import { FiMail } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/users/forgot-password", { email });
      toast.success("Reset link sent! Check your email.");
      setEmail("");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-[Poppins]">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        {/* Logo */}
        {/* <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide text-gray-900">
            NEPALWEARS<span className="text-orange-400">.</span>
          </h1>
        </div> */}

        {/* Heading */}
       <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-sm text-gray-500">Enter your registered email</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <FiMail size={20} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Sign In link */}
        <p className="mt-6 text-gray-500 text-sm text-center">
          Remember the password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
