"use client"

import { useState, useEffect,useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Search, Edit, Trash2, Eye, UserCheck, UserX, Mail } from "lucide-react"
import {
  fetchAllUsers,
  updateUserStatus,
  bulkUserAction,
  deleteUser,
  setUsersSearchTerm,
  setUsersFilterRole,
  toggleUserSelection,
  selectAllUsers,
  clearSelectedUsers,
  clearError,
  clearSuccess
} from "../store/slices/adminSlice"
import EditUser from "./EditUser"

const AdminUserTable = ({ defaultFilter = "all", title = "User Management" }) => {
  const dispatch = useDispatch()
  const {
    users,
    usersLoading,
    usersSearchTerm,
    usersFilterRole,
    selectedUsers,
    usersPagination,
    error,
    success
  } = useSelector((state) => state.admin)

  const [localSearchTerm, setLocalSearchTerm] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Initialize filter from props
  useEffect(() => {
    dispatch(setUsersFilterRole(defaultFilter))
  }, [defaultFilter, dispatch])

  // Fetch users when component mounts or filters change
  useEffect(() => {
    const filters = {
      search: usersSearchTerm,
      role: usersFilterRole !== "all" ? usersFilterRole : undefined
    }
    
    dispatch(fetchAllUsers(filters))
  }, [usersSearchTerm, usersFilterRole, dispatch])

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      dispatch(setUsersSearchTerm(localSearchTerm))
    }, 400)

    setSearchTimeout(timeout)

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [localSearchTerm, dispatch])

  // Clear messages after some time
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError())
        if (success) dispatch(clearSuccess())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success, dispatch])

  const handleUserAction = async (userId, action) => {
    try {
      if (action === "delete") {
        if (window.confirm("Are you sure you want to delete this user?")) {
          await dispatch(deleteUser(userId)).unwrap()
        }
      } else {
        await dispatch(updateUserStatus({ userId, action })).unwrap()
      }
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error)
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return

    try {
      if (action === "delete") {
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
          await dispatch(bulkUserAction({ 
            userIds: selectedUsers, 
            action 
          })).unwrap()
        }
      } else {
        await dispatch(bulkUserAction({ 
          userIds: selectedUsers, 
          action 
        })).unwrap()
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error)
    }
  }

  const handleToggleUserSelection = (userId) => {
    dispatch(toggleUserSelection(userId))
  }

  const handleSelectAllUsers = () => {
    const allUserIds = users.map(user => user._id)
    dispatch(selectAllUsers(allUserIds))
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }

  const handleSendEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank')
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter users locally for immediate UI response
  const filteredUsers = users.filter(user => {
    const matchesSearch = !usersSearchTerm || 
      user.Fullame?.toLowerCase().includes(usersSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(usersSearchTerm.toLowerCase())
    
    const matchesRole = usersFilterRole === "all" || user.role === usersFilterRole
    
    return matchesSearch && matchesRole
  })

  const typingTimeout = useRef(null)

const handleSearchChange = (e) => {
  const value = e.target.value

  // clear previous timeout if user keeps typing
  if (typingTimeout.current) {
    clearTimeout(typingTimeout.current)
  }

  // set new timeout
  typingTimeout.current = setTimeout(() => {
    setLocalSearchTerm(value)
  }, ) // delay = 500ms
}

  // Calculate display counts safely
  const totalUsers = usersPagination?.total || users.length
  const showingCount = filteredUsers.length

  if (usersLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Error and Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg m-4">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

            {/* Search and Filter */}
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <select
                value={usersFilterRole}
                onChange={(e) => dispatch(setUsersFilterRole(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-sm text-gray-600">{selectedUsers.length} user(s) selected</span>
              <button
                onClick={() => handleBulkAction("activate")}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("send-email")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Send Email
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => dispatch(clearSelectedUsers())}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllUsers}
                    checked={selectedUsers.length === users.length && users.length > 0}
                    className="rounded text-blue-600"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleToggleUserSelection(user._id)}
                      className="rounded text-blue-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.FullName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.FullName || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.isEmailVerified ? (
                        <UserCheck className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className="text-sm text-gray-900">
                        {user.isEmailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.enrollments || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendEmail(user.email)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user._id, "delete")}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !usersLoading && (
          <div className="p-8 text-center">
            <div className="text-gray-500">No users found matching your criteria.</div>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {showingCount} of {totalUsers} users
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={!usersPagination?.hasPrev}
              >
                Previous
              </button>
              <button 
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={!usersPagination?.hasNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUser 
          user={selectedUser} 
          onClose={handleCloseEditModal}
          onUserUpdate={() => {
            // Refresh users list after update
            const filters = {
              search: usersSearchTerm,
              role: usersFilterRole !== "all" ? usersFilterRole : undefined
            }
            dispatch(fetchAllUsers(filters))
          }}
        />
      )}
    </>
  )
}

export default AdminUserTable