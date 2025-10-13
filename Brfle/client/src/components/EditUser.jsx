"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { X, Save, User, Mail, Shield } from "lucide-react"
import { updateUserRole } from "../store/slices/adminSlice"

const EditUser = ({ user, onClose, onUserUpdate }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    FullName: "",
    email: "",
    role: "student"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        FullName: user.FullName || "",
        email: user.email || "",
        role: user.role || "student"
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await dispatch(updateUserRole({ 
        userId: user._id, 
        role: formData.role 
      })).unwrap()
      
      setSuccess("User updated successfully!")
      setTimeout(() => {
        onUserUpdate()
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || "Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Edit User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alerts */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              {success}
            </div>
          )}

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-blue-500" /> Full Name
              </label>
              <input
                type="text"
                name="FullName"
                value={formData.FullName}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-blue-500" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                placeholder="User email"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-blue-500" /> Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* User Info Display */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {user._id}</p>
              <p><strong>Verified:</strong> {user.isEmailVerified ? "Yes" : "No"}</p>
              <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
              <p><strong>Last Login:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update User
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  )
}

export default EditUser
