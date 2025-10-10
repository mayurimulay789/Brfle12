// import React, { useState } from "react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <nav className="w-full fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-md text-white shadow-sm font-sans">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-amber-600">
//             BRFLE
//           </h1>
//           <span className="text-xs md:text-sm font-light text-white">
//             International Open Learning
//           </span>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-6 font-medium text-sm md:text-base">
//           {["Home", "About", "Features", "Courses", "Global Presence", "Services"].map(
//             (item) => (
//               <a
//                 key={item}
//                 href={`#${item.toLowerCase().replace(" ", "")}`}
//                 className="hover:text-gray-300 transition-colors text-white"
//               >
//                 {item}
//               </a>
//             )
//           )}
//           <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold text-xs md:text-sm py-1.5 px-4 rounded-lg transition">
//             Enroll Now
//           </button>
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="md:hidden">
//           <button onClick={toggleMenu} className="text-white focus:outline-none">
//             {isOpen ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-black/90 text-white px-8 py-6 space-y-5 font-medium text-sm shadow-md">
//           {["Home", "About", "Features", "Courses", "Global Presence", "Services"].map(
//             (item) => (
//               <a
//                 key={item}
//                 href={`#${item.toLowerCase().replace(" ", "")}`}
//                 className="block hover:text-gray-300 transition-colors text-white"
//                 onClick={() => setIsOpen(false)}
//               >
//                 {item}
//               </a>
//             )
//           )}
//           <button className="w-full bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs py-2 px-4 rounded-lg transition">
//             Enroll Now
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }







import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../feature/auth/authSlice";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    // { name: "Features", path: "/features" },
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
     {/* Bigger white dot */}
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
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-gray-300 transition-colors text-white border border-white rounded px-3 py-1 text-sm flex items-center"
              >
                {user?.username}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/certificates"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Certificates
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin-panel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  {user?.role === 'instructor' && (
                    <Link
                      to="/instructor-panel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Instructor Panel
                    </Link>
                  )}
                  <Link
                    to="/my-courses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Courses
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                className="hover:bg-amber-600 transition-colors text-white border border-amber-700 bg-amber-500  rounded px-3 py-1.5 text-sm"
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
          {/* <button className="bg-white hover:bg-white text-black font-semibold text-xs md:text-sm py-1.5 px-4 rounded-lg transition">
            Enroll Now
          </button> */}
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
        <div className="md:hidden bg-black/90 text-white px-8 py-6 space-y-5 font-medium text-sm shadow-md">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block hover:text-gray-300 transition-colors text-white"
              onClick={() => setIsOpen(false)} // close menu on click
            >
              {item.name}
            </Link>
          ))}
          {/* <button className="w-full bg-white hover:bg-white text-black font-semibold text-xs py-2 px-4 rounded-lg transition">
            Enroll Now
          </button> */}
        </div>
      )}
    </nav>
  );
}
