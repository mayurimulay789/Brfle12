// import { MapPin, Users, Heart } from "lucide-react";

// const locations = [
//   {
//     country: "India",
//     region: "South Asia",
//     cities: ["Mumbai", "Nashik", "Pune", "Delhi", "Goa", "Darjeeling"],
//   },
//   {
//     country: "UAE",
//     region: "Middle East",
//     cities: ["Dubai"],
//   },
//   {
//     country: "Netherlands",
//     region: "Europe",
//     cities: ["Amsterdam"],
//   },
//   {
//     country: "USA",
//     region: "North America",
//     cities: ["Florida"],
//   },
// ];

// export default function GlobalPresence() {
//   return (
//     <div className="bg-gray-900 py-16 px-6 lg:px-12">
//       {/* Title */}
//       <h1 className="text-4xl font-bold text-center text-amber-200 mb-4">
//         Global Presence & Community
//       </h1>
//       <p className="text-center text-gray-200 max-w-3xl mx-auto mb-14 text-lg">
//         BRFLE representatives across the globe are contributing, coordinating,
//         helping, and participating in the venture of new open education &amp;
//         learning for everyone on Earth.
//       </p>

//       {/* Content Grid */}
//       <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
//         {/* Left Side Image */}
//         <div className="rounded-2xl overflow-hidden shadow-md h-96 bg-black">
//           <img
//             src="/earth.jpeg"
//             alt="World Map"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Right Side Locations */}
//         <div className="space-y-6">
//           {locations.map((loc, index) => (
//             <div
//               key={index}
//               className="border rounded-xl p-6 bg-white shadow hover:shadow-md transition"
//             >
//               <div className="flex items-center gap-2 mb-3">
//                 <MapPin className="text-cyan-800" size={22} />
//                 <h2 className="text-lg font-bold text-cyan-800">{loc.country}</h2>
//                 <span className="text-xs bg-green-100 text-cyan-700 px-2 py-0.5 rounded">
//                   {loc.region}
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {loc.cities.map((city, i) => (
//                   <span
//                     key={i}
//                     className="px-3 py-1 bg-green-50 text-cyan-700 rounded-full text-sm"
//                   >
//                     {city}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}

//           {/* Stats - Left Aligned Now */}
//           <div className="grid grid-cols-2 gap-6 mt-6">
//             <div className="border rounded-xl p-6 bg-white shadow hover:shadow-md transition">
//               <div className="flex items-center gap-3 mb-2">
//                 <Users className="text-cyan-700" size={26} />
//                 <p className="text-2xl font-bold text-cyan-800">4+</p>
//               </div>
//               <span className="text-gray-600 text-sm">Countries</span>
//             </div>
//             <div className="border rounded-xl p-6 bg-white shadow hover:shadow-md transition">
//               <div className="flex items-center gap-3 mb-2">
//                 <Heart className="text-cyan-700" size={26} />
//                 <p className="text-2xl font-bold text-cyan-800">10+</p>
//               </div>
//               <span className="text-gray-600 text-sm">Cities</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Global Mission */}
//      {/* Global Mission - full width, same alignment as above content */}
// <div className="mt-20 bg-white rounded-xl shadow-sm max-w-7xl mx-auto px-6 lg:px-12 py-10">
//   <h2 className="text-2xl font-bold text-cyan-800 mb-4 text-center">
//     Our Global Mission
//   </h2>
//   <p className="text-gray-800 text-lg leading-relaxed">
//     Everyone should benefit and progress, as per the pure noble desire of
//     an individual they should be able to live. BRFLE International Open
//     Learning is working for every person on Earth, creating wholesome
//     personalities of the new age through dedicated experts, guides, and
//     facilitators who approach knowledge impartation through constant
//     experiments and practical applications.
//   </p>
// </div>

//     </div>
//   );
// }






import React from "react";
import { MapPin } from "lucide-react";

const locations = [
  {
    country: "India",
    region: "South Asia",
    cities: ["Mumbai", "Nashik", "Pune", "Delhi", "Goa", "Darjeeling"],
  },
  {
    country: "UAE",
    region: "Middle East",
    cities: ["Dubai"],
  },
  {
    country: "Netherlands",
    region: "Europe",
    cities: ["Amsterdam"],
  },
  {
    country: "USA",
    region: "North America",
    cities: ["Florida"],
  },
];

function GlobalPresence() {
  return (
    <div className="bg-gray-900 py-16 px-6 lg:px-12">
      <h2 className="text-3xl font-bold text-white mb-5 sm:text-4xl text-center">
               Global Presence
            </h2>
      <div className="bg-white rounded-xl shadow-sm max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Side Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-md h-80 flex flex-col items-center">
          <p className="flex items-center gap-2 text-center text-gray-700 mt-1 mb-4 text-sm sm:text-base">
    <i className="fas fa-map-marker-alt text-red-600 text-lg"></i>
    Prima, Model Colony, Pune, MH, India
  </p>
            <img
              src="/earth.jpeg" // 👉 replace with your Global Presence image
              alt="Global Presence"
              className="w-full h-full object-cover"
            />
  {/* 👇 Text over Earth image */}
  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-lg font-semibold">
    Live World Life
  </p>
          </div>
          

          {/* Right Side Content */}
          <div>
            {/* Centered Heading */}
            {/* <h2 className="text-3xl font-bold text-cyan-800 mb-5 text-left">
              Our Global Presence
            </h2> */}

            <p className="text-gray-800 text-lg leading-relaxed mb-4">
              BRFLE International Open Learning is spreading knowledge across
              continents with a growing community of learners and facilitators. 
              We are active in multiple countries and cities, connecting people 
              through education and collaboration.
            </p>
            <p className="text-gray-800 text-lg leading-relaxed mb-6">
              From India to the UAE, Europe to North America, our presence 
              continues to expand, bringing together individuals, experts, and 
              guides who believe in open and accessible learning for everyone.
            </p>

            {/* Countries & Cities List */}
            {/* Countries & Cities - Grid */}
<div className="grid sm:grid-cols-2 gap-6">
  {locations.map((loc, index) => (
    <div key={index} className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-cyan-800 flex items-center gap-2 mb-2">
        <MapPin className="text-cyan-700" size={18} />
        {loc.country}
      </h3>
      <p className="text-xs text-gray-600 mb-2">{loc.region}</p>
      <div className="flex flex-wrap gap-2">
        {loc.cities.map((city, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-white border rounded text-sm text-gray-700"
          >
            {city}
          </span>
        ))}
      </div>
    </div>
  ))}
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalPresence;