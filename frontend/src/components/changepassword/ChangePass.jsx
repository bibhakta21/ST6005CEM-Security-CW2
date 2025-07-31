import React, { useState, useContext } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function ChangePass() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3000/api/users/change-password",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password changed successfully! Logging out...");
      setFormData({ oldPassword: "", newPassword: "" });

      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to change password";

      // 🧠 Custom error for reused password
      if (msg.toLowerCase().includes("reuse")) {
        setError("Old password detected! Please choose a new password you haven’t used recently.");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-[Poppins]">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Change Password</h2>
          <p className="text-sm text-gray-500">Update your password below</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <FiLock size={20} />
            </div>
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
              tabIndex={-1}
            >
              {showOldPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <FiLock size={20} />
            </div>
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
              tabIndex={-1}
            >
              {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-md"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
