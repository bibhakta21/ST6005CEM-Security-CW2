import { useContext, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../../context/UserContext";


const RECAPTCHA_SITE_KEY = "6LczjZIrAAAAAJPjf2N0jJA3dGG_tzgnDgKF7fbg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  if (!captchaToken) {
    setLoading(false);
    setError("Please complete the CAPTCHA.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, captchaToken }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    if (data.mfaRequired) {
      navigate("/otpverify", { state: { userId: data.userId } });
      return;
    }

    localStorage.setItem("token", data.token);
    const userResponse = await fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      setUser(userData);
    }

    setSuccess("Login successful! Redirecting...");
    setTimeout(() => navigate("/"), 2000);
  } catch (err) {
    setLoading(false);
    setError("Something went wrong. Please try again.");
  }
};


  const handleVerifyMfa = async () => {
    if (!mfaCode) return setError("Enter your MFA code");

    try {
      const res = await fetch("http://localhost:3000/api/users/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mfaCode }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Invalid MFA code");

      localStorage.setItem("token", data.token);

      const userRes = await fetch("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError("MFA verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-[Poppins] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Welcome back!</h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center mb-3">{success}</p>}

        {!requiresMfa ? (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* CAPTCHA */}
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link to="/forgotpass" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

         <button
  type="submit"
  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition-all duration-200 flex justify-center"
  disabled={loading}
>
  {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
</button>


            <p className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-700">MFA code sent to your email.</p>
            <input
              type="text"
              placeholder="Enter MFA Code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleVerifyMfa}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition-all"
            >
              Verify MFA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
