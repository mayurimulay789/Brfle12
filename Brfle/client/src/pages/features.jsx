// import React from "react";
// import {
//   ClockIcon,
//   CurrencyDollarIcon,
//   BoltIcon,
//   UserGroupIcon,
//   DeviceTabletIcon,
//   AdjustmentsHorizontalIcon,
//   WrenchIcon,
//   ArrowTrendingUpIcon,
// } from "@heroicons/react/24/solid";

// const features = [
//   {
//     title: "Flexibility",
//     description:
//       "Learn at your own pace, anytime, anywhere. No rigid schedules or classroom constraints.",
//     icon: ClockIcon,
//   },
//   {
//     title: "Affordability",
//     description:
//       "Quality education accessible to all with cost-effective learning solutions.",
//     icon: CurrencyDollarIcon,
//   },
//   {
//     title: "Simplicity",
//     description:
//       "User-friendly processes and interfaces that make learning effortless and enjoyable.",
//     icon: BoltIcon,
//   },
//   {
//     title: "Community Learning",
//     description:
//       "Connect with like-minded individuals sharing similar interests and goals.",
//     icon: UserGroupIcon,
//   },
//   {
//     title: "Online & Offline",
//     description:
//       "Hybrid learning approach combining digital convenience with practical applications.",
//     icon: DeviceTabletIcon,
//   },
//   {
//     title: "Practical Focus",
//     description:
//       "Emphasis on real-world applications and hands-on experience for lasting impact.",
//     icon: AdjustmentsHorizontalIcon,
//   },
//   {
//     title: "Utility Importance",
//     description:
//       "Education designed for immediate practical use and career advancement.",
//     icon: WrenchIcon,
//   },
//   {
//     title: "Result Oriented",
//     description:
//       "Focus on measurable outcomes and continuous improvement in learning journeys.",
//     icon: ArrowTrendingUpIcon,
//   },
// ];

// export default function FeaturesSection() {
//   return (
//     <div className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
//       {/* Section Header */}
//       <div className="max-w-7xl mx-auto text-center">
//         <h2 className="text-3xl font-bold text-amber-200 sm:text-4xl">
//           Key Features of International Open Learning
//         </h2>
//         <p className="mt-4 text-lg text-gray-200">
//           Experience the future of education with our innovative approach to
//           learning that combines flexibility, practicality, and global
//           connectivity.
//         </p>
//       </div>

//       {/* Features Grid */}
//       <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
//         {features.map((feature) => (
//           <div
//             key={feature.title}
//             className="bg-white border rounded-lg p-6 shadow-sm transition-all duration-300 
//                        hover:shadow-lg hover:-translate-y-2"
//           >
//             <feature.icon className="h-8 w-8 text-cyan-800 mb-4" />
//             <h3 className="text-lg font-semibold text-gray-800">
//               {feature.title}
//             </h3>
//             <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="mt-16 bg-white py-10 px-6 rounded-lg text-center max-w-7xl mx-auto">
//         <h3 className="text-2xl font-bold text-cyan-800">
//           Ready to Transform Your Learning Journey?
//         </h3>
//         <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
//           Join thousands of learners worldwide who are already experiencing the
//           BRFLE difference. Start your journey today with our flexible,
//           practical, and results-oriented approach.
//         </p>
//       </div>
//     </div>
//   );
// }


import React from "react";
import {
  ClockIcon,
  CurrencyDollarIcon,
  BoltIcon,
  UserGroupIcon,
  DeviceTabletIcon,
  AdjustmentsHorizontalIcon,
  WrenchIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";

const features = [
  { title: "Flexibility", description: "Learn at your pace, anytime, anywhere.", icon: ClockIcon },
  { title: "Affordability", description: "Quality education at a fair cost.", icon: CurrencyDollarIcon },
  { title: "Simplicity", description: "Easy-to-use learning experience.", icon: BoltIcon },
  { title: "Community Learning", description: "Grow with learners worldwide.", icon: UserGroupIcon },
  { title: "Online & Offline", description: "Blend digital and practical learning.", icon: DeviceTabletIcon },
  { title: "Practical Focus", description: "Real-world skills that matter.", icon: AdjustmentsHorizontalIcon },
  { title: "Utility Importance", description: "Knowledge for daily and career use.", icon: WrenchIcon },
  { title: "Result Oriented", description: "Learning with measurable outcomes.", icon: ArrowTrendingUpIcon },
];

export default function FeaturesSection() {
  return (
    <div className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-7xl mx-auto text-center mt-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Key Features of International Open Learning
        </h2>
        <p className="mt-5 text-lg text-gray-300">
          Experience education built on flexibility, practicality, and global reach.
        </p>
      </div>
      
      {/* 3 Images Row */}
      <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-9" >
        <img
          src="/images/ab2.jpeg"
          alt="Feature 1"
          className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg"
        />
        <img
          src="/images/ab1.jpeg"
          alt="Feature 2"
          className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg"
        />
        <img
          src="/images/ab3.jpeg"
          alt="Feature 3"
          className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg"
        />
      </div>

  

      {/* Features Grid */}
      <div className="mt-20 max-w-7xl mx-auto grid gap-8 
                      grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center text-center
                       transition-transform transform hover:scale-105 hover:shadow-xl h-full"
          >
            <feature.icon className="h-12 w-12 text-black mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 flex-1">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}