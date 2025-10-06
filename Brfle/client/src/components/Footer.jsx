// // src/components/Footer.jsx
// import { Mail, Phone, MapPin } from "lucide-react";
// import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
// import { Link } from "react-router-dom";


// export default function Footer() {
//   return (
//     <footer style={{ backgroundColor: "#996515" }} className="py-12">
//       {/* Top Section */}
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
//         {/* Left Section */}
//         <div>
//           <h2 className="text-2xl font-bold text-[#F5F5F5]">BRFLE</h2>
//           <p className="mt-4 text-[#E0CDA9]">
//             International Open Learning bringing world-class learning experiences to your
//             doorstep. Inspired by eternal wisdom, powered by modern technology.
//           </p>

//           {/* Newsletter */}
//           <div className="mt-6">
//             <h3 className="text-[#F5F5F5] font-semibold">Stay Connected</h3>
//             <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="px-4 py-2 rounded-md bg-[#5c360b] border border-[#7a4a10] text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FFD700] w-full"
//               />
//               <button className="px-5 py-2 bg-[#7a4a10] hover:bg-[#5c360b] text-[#FFD700] font-semibold rounded-md">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Quick Links */}
//         <div className="md:pl-16">
//           <h3 className="text-[#F5F5F5] font-semibold mb-4">Quick Links</h3>
//          <ul className="space-y-3">
//   <li><Link to="/" className="text-[#E0CDA9] hover:text-[#FFD700]">Home</Link></li>
//   <li><Link to="/about" className="text-[#E0CDA9] hover:text-[#FFD700]">About BRFLE</Link></li>
//   <li><Link to="/courses" className="text-[#E0CDA9] hover:text-[#FFD700]">Our Courses</Link></li>
//   <li><Link to="/features" className="text-[#E0CDA9] hover:text-[#FFD700]">Features</Link></li>
//     <li><Link to="/globalpresence" className="text-[#E0CDA9] hover:text-[#FFD700]">Global Presence</Link></li>
//   <li><Link to="/services" className="text-[#E0CDA9] hover:text-[#FFD700]">Services</Link></li>

// </ul>
// </div>


//         {/* Contact Info */}
//         <div>
//           <h3 className="text-[#F5F5F5] font-semibold mb-4">Get in Touch</h3>
//           <ul className="space-y-3">
//             <li className="flex items-center space-x-2">
//               <Mail className="w-5 h-5 text-[#FFD700]" />
//               <span className="text-[#E0CDA9]">info@brfle.edu</span>
//             </li>
//             <li className="flex items-center space-x-2">
//               <Phone className="w-5 h-5 text-[#FFD700]" />
//               <span className="text-[#E0CDA9]">+1 (555) 123-4567</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <MapPin className="w-5 h-5 text-[#FFD700] mt-1" />
//               <div>
//                 <p className="text-[#E0CDA9]">Mumbai, India</p>
//                 <p className="text-[#E0CDA9]">Dubai, UAE</p>
//                 <p className="text-[#E0CDA9]">Amsterdam, Netherlands</p>
//                 <p className="text-[#E0CDA9]">Florida, USA</p>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="border-t border-[#7a4a10] mt-12 pt-6 text-center space-y-4">
//         <p className="text-[#E0CDA9] text-sm">
//           © 2025 BRFLE International Open Learning. Made with{" "}
//           <span className="text-red-400">❤</span> for learners worldwide.
//         </p>
//         <p className="text-[#F5F5F5] italic text-sm">
//           "Knowledge is gained, understanding is enhanced, grasping is improved, proficiency is achieved, 
//           various deficiencies are eliminated." — Y P Baba
//         </p>

//         {/* Social Icons */}
//         <div className="flex justify-center space-x-4 mt-4">
//           <a href="#" className="bg-[#5c360b] hover:bg-[#FFD700] p-3 rounded-full text-[#F5F5F5]">
//             <FaFacebookF />
//           </a>
//           <a href="#" className="bg-[#5c360b] hover:bg-[#FFD700] p-3 rounded-full text-[#F5F5F5]">
//             <FaTwitter />
//           </a>
//           <a href="#" className="bg-[#5c360b] hover:bg-[#FFD700] p-3 rounded-full text-[#F5F5F5]">
//             <FaLinkedinIn />
//           </a>
//           <a href="#" className="bg-[#5c360b] hover:bg-[#FFD700] p-3 rounded-full text-[#F5F5F5]">
//             <FaInstagram />
//           </a>
//         </div>
//       </div>
//     </footer>
    
//   );
// }




import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">BRFLE</h2>
          <p className="mt-4 text-gray-300">
            International Open Education bringing world-class learning experiences to your
            doorstep. Inspired by eternal wisdom, powered by modern technology.
          </p>

          {/* Newsletter */}
          <div className="mt-6">
            <h3 className="text-white font-semibold">Stay Connected</h3>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
              />
              <button className="px-5 py-2 bg-white hover:bg-gray-200 text-black font-semibold rounded-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:pl-20">
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3">
             <li>
    <Link to="/" className="text-gray-300 hover:text-gray-200">
      Home
    </Link>
  </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-gray-200">
                About
              </Link>
            </li>
            {/* <li>
              <Link to="/features" className="text-gray-300 hover:text-gray-200">
                Features
              </Link>
            </li> */}
            <li>
  <Link to="/courses" className="text-gray-300 hover:text-gray-200">
    Courses
  </Link>
</li>


              <li>
              <Link to="/services" className="text-gray-300 hover:text-gray-200">
                Services
              </Link>
            </li>
              <li>
              <Link to="/globalpresence" className="text-gray-300 hover:text-gray-200">
                Global Presence
              </Link>
            </li>
          
          
          </ul>
        </div>

        {/* Contact Info */}
<div>
  <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
  <ul className="space-y-3">
    {/* Email */}
    <li className="flex items-center space-x-2">
      <Mail className="w-5 h-5 text-white" />
      <span className="text-gray-300">brafle@gmail.com</span>
    </li>

    {/* Phone */}
    <li className="flex items-center space-x-2">
      <Phone className="w-5 h-5 text-white" />
      <span className="text-gray-300">+ 91_ 9822066100</span>
    </li>

    {/* Admin Office */}
    <li className="flex items-start space-x-2">
      <MapPin className="w-5 h-5 text-white mt-1" />
      <div>
        <p className="text-white font-semibold">Admin Office:</p>
        <p className="text-gray-300">Prima, Model Colony</p>
        <p className="text-gray-300"> Pune, MH, India</p>
      </div>
    </li>

    {/* Represent Locations */}
    <li className="flex items-start space-x-2">
      <MapPin className="w-5 h-5 text-white mt-1" />
      <div>
        <p className="text-white font-semibold">Presently Represent:</p>
        <p className="text-gray-300">Mumbai, Goa, Dubai, </p>
        <p className="text-gray-300">Amsterdam (Netherlands), Florida (USA)</p>
      </div>
    </li>
  </ul>
</div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center space-y-4">
        <p className="text-gray-400 text-sm">
          © 2025 BRFLE International Open Education. Made with{" "}
          <span className="text-red-400">❤</span> for learners worldwide.
        </p>
        <p className="text-gray-300 italic text-sm">
          "Knowledge is gained, understanding is enhanced, grasping is improved, proficiency is achieved,
          various deficiencies are eliminated." — Y P Baba
        </p>

        {/* Social Icons */}
        <div className="py-4 text-center">
          <p className="mb-3 text-white text-2xl">Explore on :</p>
          <div className="flex justify-center space-x-5">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-blue-500 text-3xl">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-sky-400 text-3xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-red-600 text-3xl">
              <i className="fab fa-pinterest-p"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-pink-500 text-3xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-red-500 text-3xl">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform bg-white rounded-full px-2 text-black text-3xl">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-green-500 text-3xl">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}