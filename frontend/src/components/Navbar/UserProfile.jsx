import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fallbackAvatar from "../../assets/sandip.jpg"; // Fallback avatar

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
      setError(""); // Clear any previous error
    }
  };

  if (!user) return <div className="text-center py-10 font-[Poppins]">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-[Poppins]">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">My Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              user.avatar
                ? `http://localhost:3000/uploads/${user.avatar}`
                : fallbackAvatar
            }
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shadow-sm"
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
        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            {editMode ? (
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
            ) : (
              <p className="mt-1 text-gray-800">{user.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
            ) : (
              <p className="mt-1 text-gray-800">{user.email}</p>
            )}
          </div>

          {/* MFA */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Multi-Factor Authentication</label>
            <p className="mt-1 text-gray-800">{user.mfaEnabled ? "Enabled ✅" : "Disabled ❌"}</p>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-between">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={() => navigate("/changepass")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md transition"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
