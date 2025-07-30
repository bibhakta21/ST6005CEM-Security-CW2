import React, { createContext, useState, useEffect } from "react";
import axios from "../utils/axiosConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Fetch cart count (only items without addressOne)
  const fetchCartCount = async () => {
    try {
      const res = await axios.get("/bookings");
      const userCart = res.data.filter(
        (item) => !item.addressOne || item.addressOne.trim() === ""
      );
      setCartCount(userCart.length);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      setCartCount(0);
    }
  };

  // ✅ On page load: fetch user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        setUser(res.data);
        await fetchCartCount();
      })
      .catch((err) => {
        console.error("Token invalid or expired:", err);
        localStorage.removeItem("token");
        setUser(null);
        setCartCount(0);
      });
  }, []);

  // ✅ On login
  const login = async (email, password, captchaToken) => {
    const { data } = await axios.post("/users/login", {
      email,
      password,
      captchaToken,
    });

    if (data.mfaRequired) {
      setMfaRequired(true);
      setMfaUserId(data.userId);
      return { mfa: true };
    }

    // ✅ Save token
    localStorage.setItem("token", data.token);

    const res = await axios.get("/users/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    setUser(res.data);
    await fetchCartCount();
    return {};
  };

  // ✅ On OTP verify (MFA)
  const verifyMfa = async (token) => {
    const { data } = await axios.post("/users/verify-mfa", {
      userId: mfaUserId,
      token,
    });

    // ✅ Save token
    localStorage.setItem("token", data.token);
    setMfaRequired(false);

    const res = await axios.get("/users/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    setUser(res.data);
    await fetchCartCount();
  };

  // ✅ On logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartCount(0);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        mfaRequired,
        login,
        verifyMfa,
        logout,
        cartCount,
        setCartCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
