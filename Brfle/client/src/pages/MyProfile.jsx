import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { CalendarDays, MapPin, Phone, Mail } from "lucide-react";

const MyProfile = () => {
  const { user, token } = useSelector((state) => state.auth); // ✅ Corrected
  const [formData, setFormData] = useState({
    FullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    country: "India",
    city: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return; // Prevent API call if not logged in
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          FullName: res.data.user.FullName || "",
          email: user?.email || "", // ✅ Take email from Redux login info
          phone: res.data.user.phone || "",
          dateOfBirth: res.data.user.dateOfBirth || "",
          gender: res.data.user.gender || "",
          country: res.data.user.country || "India",
          city: res.data.user.city || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [user, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle save profile
  const handleSave = async () => {
    if (!token) {
      alert("❌ You must be logged in to update your profile.");
      return;
    }
    try {
      await axios.put("http://localhost:5000/api/auth/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      alert("✅ Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-4 px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm opacity-90">Manage your personal information</p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-amber-700 font-medium px-4 py-1.5 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-1.5 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="FullName"
              value={formData.FullName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded-md text-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full pl-9 p-2 border rounded-md text-sm bg-gray-100"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="+91 9876543210"
                className={`w-full pl-9 p-2 border rounded-md text-sm ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full pl-9 p-2 border rounded-md text-sm ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md text-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md text-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full pl-9 p-2 border rounded-md text-sm ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
