import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // ✅ Enhanced debugging
  useEffect(() => {
    console.log("🔍 Navbar Debug - Full auth state:", { user, isAuthenticated });
    console.log("🔍 User object:", user);
    console.log("🔍 Is Authenticated:", isAuthenticated);
    console.log("🔍 User type:", typeof user);
    console.log("🔍 User properties:", user ? Object.keys(user) : "No user");
    
    // Also check localStorage as fallback
    const storedUser = localStorage.getItem('user');
    console.log("🔍 LocalStorage user:", storedUser);
  }, [user, isAuthenticated]);

  // ✅ Correct user display name function
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // Use the correct field name: FullName (capital F)
    return user.FullName || user.email || 'User';
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    setIsOpen(false);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Services", path: "/services" },
    { name: "Global Presence", path: "/globalpresence" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-md text-white shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-white"></span>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
              BRFLE
            </h1>
          </div>
          <span className="text-xs md:text-sm font-light text-white">
            International Open Learning
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-medium text-sm md:text-base">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:text-gray-300 transition-colors text-white"
            >
              {item.name}
            </Link>
          ))}
          
          {/* ✅ Fixed Auth Section with correct field names */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-gray-300 transition-colors text-white border border-white rounded px-3 py-1 text-sm flex items-center"
              >
                {getUserDisplayName()} {/* ✅ Now uses correct field */}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {/* ✅ Show panels based on user role */}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin-panel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  {user?.role === 'instructor' && (
                    <Link
                      to="/instructor-panel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Instructor Panel
                    </Link>
                  )}
                  
                  <Link
                    to="/my-courses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Courses
                  </Link>
                  
                  <Link
                    to="/certificates"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Certificates
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:bg-amber-600 transition-colors text-white border border-amber-700 bg-amber-500 rounded px-3 py-1.5 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:bg-amber-600 transition-colors text-white border border-amber-700 bg-amber-500 rounded px-3 py-1.5 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 text-white px-8 py-6 space-y-5 font-medium text-sm shadow-md">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block hover:text-gray-300 transition-colors text-white py-2 border-b border-gray-700"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* ✅ Mobile Auth Section with correct field names */}
          <div className="pt-4 border-t border-gray-700">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-amber-400 text-sm">
                  Welcome, {getUserDisplayName()} {/* ✅ Now uses correct field */}
                </div>
                <Link
                  to="/dashboard"
                  className="block hover:text-gray-300 transition-colors text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin-panel"
                    className="block hover:text-gray-300 transition-colors text-white py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                {user?.role === 'instructor' && (
                  <Link
                    to="/instructor-panel"
                    className="block hover:text-gray-300 transition-colors text-white py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Instructor Panel
                  </Link>
                )}
                <Link
                  to="/my-courses"
                  className="block hover:text-gray-300 transition-colors text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  My Courses
                </Link>
                <Link
                  to="/certificates"
                  className="block hover:text-gray-300 transition-colors text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Certificates
                </Link>
                <Link
                  to="/profile"
                  className="block hover:text-gray-300 transition-colors text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-400 hover:text-red-300 py-2 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4 pt-2">
                <Link
                  to="/login"
                  className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}