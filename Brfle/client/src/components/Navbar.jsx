// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logoutUser } from "../store/slices/authSlice";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const toggleMenu = () => setIsOpen(!isOpen);
//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user, isAuthenticated } = useSelector((state) => state.auth);

//   // Debugging auth state
//   useEffect(() => {
//     console.log("Navbar auth state:", { user, isAuthenticated });
//   }, [user, isAuthenticated]);

//   const getUserDisplayName = () => {
//     if (!user) return 'User';
//     return user.FullName || user.email || 'User';
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setDropdownOpen(false);
//     setIsOpen(false);

//     // Redirect to login page
//     navigate("/login");
//   };

//   const menuItems = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Courses", path: "/courses" },
//     { name: "Services", path: "/services" },
//     { name: "Global Presence", path: "/globalpresence" },
//   ];

//   return (
//     <nav className="w-full fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-md text-white shadow-sm font-sans">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <div className="flex items-center space-x-2">
//             <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-white"></span>
//             <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
//               BRFLE
//             </h1>
//           </div>
//           <span className="text-xs md:text-sm font-light text-white">
//             International Open Learning
//           </span>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-6 font-medium text-sm md:text-base">
//           {menuItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               className="hover:text-gray-300 transition-colors text-white"
//             >
//               {item.name}
//             </Link>
//           ))}

//           {isAuthenticated ? (
//             <div className="relative">
//               <button
//                 onClick={toggleDropdown}
//                 className="hover:text-gray-300 transition-colors text-white border border-white rounded px-3 py-1 text-sm flex items-center"
//               >
//                 {getUserDisplayName()}
//                 <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
//                   {/* <Link
//                     to="/dashboard"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     Dashboard
//                   </Link> */}

//                   {user?.role === 'admin' && (
//                     <Link
//                       to="/admin-panel"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
//                       onClick={() => setDropdownOpen(false)}
//                     >
//                       Admin Panel
//                     </Link>
//                   )}

                  
//                   <Link
//                     to="/my-courses"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     My Courses
//                   </Link>

//                   {/* <Link
//                     to="/certificates"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     Certificates
//                   </Link> */}

//                   <Link
//                     to="/myprofile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     My Profile
//                   </Link>

//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="hover:bg-amber-600 transition-colors text-white border border-amber-700 bg-amber-500 rounded px-3 py-1.5 text-sm"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="hover:bg-amber-600 transition-colors text-white border border-amber-700 bg-amber-500 rounded px-3 py-1.5 text-sm"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="md:hidden">
//           <button onClick={toggleMenu} className="text-white focus:outline-none">
//             {isOpen ? (
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-black/95 text-white px-8 py-6 space-y-5 font-medium text-sm shadow-md">
//           {menuItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               className="block hover:text-gray-300 transition-colors text-white py-2 border-b border-gray-700"
//               onClick={() => setIsOpen(false)}
//             >
//               {item.name}
//             </Link>
//           ))}

//           <div className="pt-4 border-t border-gray-700">
//             {isAuthenticated ? (
//               <div className="space-y-3">
//                 <div className="text-amber-400 text-sm">
//                   Welcome, {getUserDisplayName()}
//                 </div>
//                 <Link to="/dashboard" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
//                 {user?.role === 'admin' && <Link to="/admin-panel" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Admin Panel</Link>}
//                 {user?.role === 'instructor' && <Link to="/instructor-panel" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Instructor Panel</Link>}
//                 <Link to="/my-courses" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>My Courses</Link>
//                 <Link to="/certificates" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Certificates</Link>
//                 <Link to="/myprofile" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>My Profile</Link>
//                 <button onClick={handleLogout} className="block w-full text-left text-red-400 hover:text-red-300 py-2 font-medium">Logout</button>
//               </div>
//             ) : (
//               <div className="flex space-x-4 pt-2">
//                 <Link to="/login" className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-sm" onClick={() => setIsOpen(false)}>Login</Link>
//                 <Link to="/register" className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-sm" onClick={() => setIsOpen(false)}>Register</Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchInputRef = useRef(null);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Debugging auth state
  useEffect(() => {
    console.log("Navbar auth state:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.FullName || user.email || 'User';
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    setIsOpen(false);

    // Redirect to login page
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to courses page with search query
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowMobileSearch(false);
      setIsOpen(false); // Close mobile menu if open
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
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
        <div className="hidden md:flex items-center space-x-4 font-medium text-sm md:text-base">
          {/* Desktop Search Bar */}
          <div className="relative mr-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search courses..."
                className="w-48 px-4 py-1.5 bg-white/10 border border-white/20 rounded-l-md focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-300 text-sm"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-r-md border border-amber-700 text-sm flex items-center"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="ml-1 hidden sm:inline">Search</span>
              </button>
            </form>
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:text-gray-300 transition-colors text-white"
            >
              {item.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-gray-300 transition-colors text-white border border-white rounded px-3 py-1 text-sm flex items-center"
              >
                {getUserDisplayName()}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin-panel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
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
                    to="/myprofile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
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

        {/* Mobile Menu Icons (Search + Hamburger) */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Search Icon */}
          <button 
            onClick={toggleMobileSearch}
            className="text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Mobile Hamburger Menu */}
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

      {/* Mobile Search Bar (when toggled) */}
      {showMobileSearch && (
        <div className="md:hidden bg-black/95 px-6 py-4 border-t border-gray-700">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search courses..."
              className="flex-grow px-4 py-2 bg-white/10 border border-white/20 rounded-l-md focus:outline-none focus:border-amber-500 text-white placeholder-gray-300"
              autoFocus
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-md border border-amber-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 text-white px-8 py-6 space-y-5 font-medium text-sm shadow-md">
          {/* Mobile Menu Search Bar */}
          <div className="pb-4 border-b border-gray-700">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search courses..."
                className="flex-grow px-4 py-2 bg-white/10 border border-white/20 rounded-l-md focus:outline-none focus:border-amber-500 text-white placeholder-gray-300"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-md border border-amber-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

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

          <div className="pt-4 border-t border-gray-700">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-amber-400 text-sm">
                  Welcome, {getUserDisplayName()}
                </div>
                <Link to="/dashboard" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                {user?.role === 'admin' && <Link to="/admin-panel" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Admin Panel</Link>}
                {user?.role === 'instructor' && <Link to="/instructor-panel" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Instructor Panel</Link>}
                <Link to="/my-courses" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>My Courses</Link>
                <Link to="/certificates" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>Certificates</Link>
                <Link to="/myprofile" className="block hover:text-gray-300 transition-colors text-white py-2" onClick={() => setIsOpen(false)}>My Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left text-red-400 hover:text-red-300 py-2 font-medium">Logout</button>
              </div>
            ) : (
              <div className="flex space-x-4 pt-2">
                <Link to="/login" className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-sm" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-sm" onClick={() => setIsOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}