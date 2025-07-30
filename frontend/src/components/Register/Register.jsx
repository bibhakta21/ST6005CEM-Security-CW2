import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const RECAPTCHA_SITE_KEY = "6LczjZIrAAAAAJPjf2N0jJA3dGG_tzgnDgKF7fbg";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
    special: false,
  });

  useEffect(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordChecks(checks);

    const passed = Object.values(checks).filter(Boolean).length;
    if (passed <= 2) setPasswordStrength("Weak");
    else if (passed <= 4) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  }, [formData.password]);

  const validateField = (name, value) => {
    let message = "";
    if (name === "username" && value.length < 5) {
      message = "Username must be at least 5 characters.";
    }
    if (name === "email" && !value.endsWith("@gmail.com")) {
      message = "Email must end with @gmail.com";
    }
    if (name === "confirmPassword" && value !== formData.password) {
      message = "Passwords do not match.";
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    setSubmitError("");
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!captchaToken) return setSubmitError("Please complete the CAPTCHA.");
    if (!agreed) return setSubmitError("You must agree to enable MFA.");
    if (Object.values(errors).some((err) => err)) return setSubmitError("Please fix validation errors.");
    if (formData.password !== formData.confirmPassword) return setSubmitError("Passwords do not match.");

    const allPassed = Object.values(passwordChecks).every(Boolean);
    if (!allPassed) return setSubmitError("Password does not meet security requirements.");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          captchaToken,
          mfaEnabled: true,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Registration successful!");
        setRegistered(true);
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      } else {
        setSubmitError(data.error || "Registration failed.");
      }
    } catch (err) {
      setLoading(false);
      setSubmitError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-[Poppins] px-4 py-20">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Register</h2>
          <p className="text-sm text-gray-500">Join the fashion revolution today</p>
        </div>

        {submitError && <p className="text-red-500 text-sm text-center mb-4">{submitError}</p>}
        {registered && (
          <p className="text-green-600 text-sm text-center mb-4">
            ✅ Please check your Gmail to verify your email.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="username" icon={<FiUser />} type="text" value={formData.username} onChange={handleChange} error={errors.username} />
            <InputField label="Email" name="email" icon={<FiMail />} type="email" value={formData.email} onChange={handleChange} error={errors.email} />
          </div>

          {/* Password + Confirm Password row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} show={showPassword} setShow={setShowPassword} error={errors.password} />
            <PasswordField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} show={showConfirmPassword} setShow={setShowConfirmPassword} error={errors.confirmPassword} />
          </div>

          {/* Password strength and checks */}
          <div className="px-1">
            <div className="h-2 rounded bg-gray-200 overflow-hidden mb-1">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength === "Weak"
                    ? "bg-red-500 w-1/3"
                    : passwordStrength === "Medium"
                    ? "bg-yellow-500 w-2/3"
                    : "bg-green-500 w-full"
                }`}
              ></div>
            </div>
            <p className={`text-sm font-semibold ${
              passwordStrength === "Strong"
                ? "text-green-600"
                : passwordStrength === "Medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}>
              Strength: {passwordStrength}
            </p>
          </div>

          <div className="text-sm mt-1 space-y-1 px-1">
            <p className={passwordChecks.length ? "text-green-600" : "text-red-600"}>
              {passwordChecks.length ? "✔" : "✖"} At least 8 characters
            </p>
            <p className={passwordChecks.number ? "text-green-600" : "text-red-600"}>
              {passwordChecks.number ? "✔" : "✖"} At least 1 number
            </p>
            <p className={passwordChecks.uppercase ? "text-green-600" : "text-red-600"}>
              {passwordChecks.uppercase ? "✔" : "✖"} At least 1 uppercase letter
            </p>
            <p className={passwordChecks.lowercase ? "text-green-600" : "text-red-600"}>
              {passwordChecks.lowercase ? "✔" : "✖"} At least 1 lowercase letter
            </p>
            <p className={passwordChecks.special ? "text-green-600" : "text-red-600"}>
              {passwordChecks.special ? "✔" : "✖"} At least 1 special character
            </p>
          </div>

          {/* MFA Agreement */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="mfa-agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-black" required />
            <label htmlFor="mfa-agree" className="text-sm text-gray-700">
              I agree to enable Multi-Factor Authentication (MFA) and complete CAPTCHA
            </label>
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
          </div>

          <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition-all duration-200 flex justify-center" disabled={!agreed || loading}>
            {loading ? <ClipLoader size={22} color="#fff" /> : "Register"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// 🔸 Reusable Input Field
function InputField({ label, name, icon, type, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// 🔸 Reusable Password Field
function PasswordField({ label, name, value, onChange, show, setShow, error }) {
  return (
    <div>
      <label className="block text-sm text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
