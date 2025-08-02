import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import { FiShield } from "react-icons/fi";

export default function OtpVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only 1 digit per input
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pasted.forEach((char, i) => {
      if (i < 6 && /^\d$/.test(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    inputRefs.current[pasted.length - 1]?.focus();
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("").trim();
    if (fullOtp.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://localhost:3000/api/users/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: String(userId).trim(),
          token: fullOtp,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid OTP. Please try again.");
        return;
      }

      localStorage.setItem("token", data.token);

      const userRes = await fetch("https://localhost:3000/api/users/me", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
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
          We've sent a one-time code to your email. It will expire in{" "}
          <span className="font-semibold">5 minutes</span>.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div
          className="flex justify-center gap-3 mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 border border-gray-300 text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-2 bg-black text-white py-3 rounded-md hover:bg-gray-900 transition-all duration-200"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
