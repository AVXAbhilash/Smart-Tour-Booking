import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, Lock, Camera, Save, Shield } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // State for loading and messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // --- NEW STATE FOR LIVE STATS ---
  const [stats, setStats] = useState({
    toursBooked: 0,
    reviewsCount: 0
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState(() => {
    return (
      localStorage.getItem("userProfileImage") ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250"
    );
  });

  const fileInputRef = useRef(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- 3. FETCH USER DATA & STATS ON LOAD ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch Profile and Bookings at the exact same time for better performance
        const [profileRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:5200/api/users/profile", config),
          axios.get("http://localhost:5200/api/bookings/mybookings", config)
        ]);

        // Attempt to fetch reviews (Wrapped in try/catch just in case the backend route isn't ready)
        let fetchedReviewCount = 0;
        try {
          const reviewsRes = await axios.get("http://localhost:5200/api/reviews/myreviews", config);
          fetchedReviewCount = reviewsRes.data.length;
        } catch (err) {
          console.warn("Could not fetch reviews. Route might be missing on backend.");
        }

        setProfileData({
          firstName: profileRes.data.firstName || "",
          lastName: profileRes.data.lastName || "",
          email: profileRes.data.email || "",
          phone: profileRes.data.phone || "",
        });

        // Update the live stats state!
        setStats({
          toursBooked: bookingsRes.data.length || 0,
          reviewsCount: fetchedReviewCount
        });

        if (profileRes.data.profileImage) {
          setProfileImage(profileRes.data.profileImage);
          localStorage.setItem("userProfileImage", profileRes.data.profileImage);
          window.dispatchEvent(new Event("profileImageUpdated"));
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data: imagePath } = await axios.post(
        "http://localhost:5200/api/upload",
        formData,
        config,
      );

      const fullImageUrl = `http://localhost:5200${imagePath}`;

      setProfileImage(fullImageUrl);
      localStorage.setItem("userProfileImage", fullImageUrl);
      window.dispatchEvent(new Event("profileImageUpdated"));

      const profileConfig = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        "http://localhost:5200/api/users/profile",
        { profileImage: fullImageUrl },
        profileConfig,
      );

      setSuccessMessage("Profile picture updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("userToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.put(
        "http://localhost:5200/api/users/profile",
        profileData,
        config,
      );

      setSuccessMessage("Profile updated successfully!");

      const currentInfo = JSON.parse(localStorage.getItem("userInfo"));
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...currentInfo,
          firstName: response.data.firstName,
        }),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match!");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        "http://localhost:5200/api/users/password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        config,
      );

      setSuccessMessage("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6">
            {successMessage}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 text-center transition-colors">
              <div className="relative inline-block mb-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900/30 shadow-lg mx-auto"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transition-colors border-2 border-white dark:border-slate-900 cursor-pointer"
                  title="Change Profile Picture"
                >
                  <Camera size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                {profileData.email}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-800 pt-6">
                <div>
                  <p className="text-3xl font-black text-primary-600 dark:text-primary-400">
                    {/* Replaced hardcoded 12 */}
                    {stats.toursBooked}
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tours Booked
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black text-primary-600 dark:text-primary-400">
                    {/* Replaced hardcoded 4 */}
                    {stats.reviewsCount}
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                  <User
                    className="text-primary-600 dark:text-primary-400"
                    size={24}
                  />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Personal Information
                </h2>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-primary-500/30 flex items-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                  <Shield
                    className="text-slate-600 dark:text-slate-400"
                    size={24}
                  />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Security & Password
                </h2>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;