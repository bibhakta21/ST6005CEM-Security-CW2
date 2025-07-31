import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fallbackAvatar from "../../assets/sandip.jpg";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setFormData({ username: data.username, email: data.email });
        } else {
          toast.error(data.error || "Failed to load user");
        }
      } catch (err) {
        toast.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, [token]);

  const handleUpdate = async () => {
    if (!formData.username.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return setError("Please provide a valid name and email.");
    }

    try {
      const body = new FormData();
      body.append("username", formData.username);
      body.append("email", formData.email);
      if (avatarFile) body.append("avatar", avatarFile);

      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated!");
        setUser(data.user);
        setEditMode(false);
        setError("");
      } else {
        setError(data.error || "Update failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (file && !validTypes.includes(file.type)) {
      setAvatarFile(null);
      setError("Please add png, jpg, gif, or jpeg images.");
    } else {
      setAvatarFile(file);
      setError("");
    }
  };

  if (!user) return <div className="text-center py-10 font-[Poppins]">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 font-[Poppins]">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-10">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">My Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              user.avatar
                ? `http://localhost:3000/uploads/${user.avatar}`
                : fallbackAvatar
            }
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shadow-md"
          />
          {editMode && (
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/jpg"
              onChange={handleAvatarChange}
              className="mt-3 text-sm text-gray-600"
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            {editMode ? (
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            ) : (
              <p className="text-gray-900">{user.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          {/* MFA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Multi-Factor Authentication</label>
            <p className="text-gray-900">{user.mfaEnabled ? "Enabled ✅" : "Disabled ❌"}</p>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          )}

          <button
            onClick={() => navigate("/changepass")}
            className="bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
          >
            Change Password
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
          >
            Order History
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition col-span-full sm:col-span-2 lg:col-span-1"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
