import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import { FiShield } from "react-icons/fi";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleVerify = async () => {
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: String(userId).trim(),
          token: String(otp).trim(),
        }),
        credentials: "include"
      });

      const data = await res.json();
      console.log("[DEBUG] MFA Verify Response:", data);

      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid OTP. Please try again.");
        return;
      }

      // Fetch user info (session cookie is set)
      const userRes = await fetch("http://localhost:3000/api/users/me", {
        credentials: "include"
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Login succeeded but failed to fetch user info.");
      }
    } catch (err) {
      console.error("[MFA VERIFY ERROR]", err);
      setLoading(false);
      setError("Failed to verify. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-[Poppins]">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center animate-fade-in">
        <div className="flex justify-center mb-4 text-4xl text-black">
          <FiShield className="text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-6">
          We've sent a one-time code to your email. It will expire in <span className="font-semibold">5 minutes</span>.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-center tracking-widest font-mono"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-5 bg-black text-white py-3 rounded-md hover:bg-gray-900 transition-all duration-200"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
