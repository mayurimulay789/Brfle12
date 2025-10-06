// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const courses = [
//   {
//     category: "Personal Development",
//     title: "Well Being and Conscious Life",
//     description:
//       "Develop holistic wellness through mindful living, spiritual growth, and balanced lifestyle practices.",
//     level: "Beginner to Advanced",
//     image: "/c2.avif",
//   },
//   {
//     category: "Leadership",
//     title: "Holistic Governance and Administration",
//     description:
//       "Master the art of ethical leadership and comprehensive administrative practices for modern organizations.",
//     level: "Intermediate",
//     image: "/leadership.jpg",
//   },
//   {
//     category: "Technology",
//     title: "Artificial Intelligence",
//     description:
//       "Explore the fascinating world of AI, machine learning, and their practical applications in various industries.",
//     level: "All Levels",
//     image: "/ed11.jpg",
//   },
//   {
//     category: "Business",
//     title: "Innovation & Entrepreneurship",
//     description:
//       "Cultivate innovative thinking and learn to transform ideas into successful business ventures.",
//     level: "Intermediate",
//     image: "/business.jpg",
//   },
//   {
//     category: "Business",
//     title: "Export Business Development",
//     description:
//       "Navigate international trade, export processes, and global business expansion strategies.",
//     level: "Intermediate to Advanced",
//     image: "/export.jpg",
//   },
//   {
//     category: "Industry",
//     title: "Tourism & Hospitality",
//     description:
//       "Discover the dynamics of tourism industry and create memorable hospitality experiences.",
//     level: "Beginner",
//     image: "/images/co5.jpg",
//   },
// ];

// export default function Courses() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const categoryFromUrl = queryParams.get("category");

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   const categories = [
//     "All",
//     "Personal Development",
//     "Leadership",
//     "Technology",
//     "Business",
//     "Industry",
//   ];

//   useEffect(() => {
//     if (categoryFromUrl) {
//       setSelectedCategory(categoryFromUrl);
//     }
//   }, [categoryFromUrl]);

//   const filteredCourses =
//     selectedCategory === "All"
//       ? courses
//       : courses.filter((course) => course.category === selectedCategory);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowModal(true);
//   };

//   return (
//     <section className="py-20 px-6 bg-gray-100">
//       <div className="max-w-7xl mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4 text-gray-900">
//           Initial Course Offerings
//         </h1>
//         <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
//           Practical and immediate career-oriented courses designed to transform
//           lives and build expertise in emerging fields and timeless wisdom
//           traditions.
//         </p>

//         {/* Category Buttons */}
//         <div className="flex flex-wrap justify-center gap-3 mb-16">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                 selectedCategory === category
//                   ? "bg-black text-white"
//                   : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {/* Courses Grid */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map((course, index) => (
//             <div
//               key={index}
//               className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
//             >
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
//               />
//               <div className="p-4 text-center flex flex-col flex-1">
//                 <p className="text-lg font-bold text-gray-900">
//                   {course.title}
//                 </p>
//                 <p className="text-sm text-gray-500">{course.category}</p>
//                 <p className="text-xs text-gray-600 mt-2">
//                   {course.description}
//                 </p>

//                 <button
//                   onClick={() => openModal(course)}
//                   className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                 >
//                   Enroll Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
//           <div className="bg-white rounded-xl max-w-3xl w-full p-4 relative">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
//             >
//               ✕
//             </button>
//             <iframe
//               src="https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true"
//               width="100%"
//               height="600"
//               frameBorder="0"
//               marginHeight="0"
//               marginWidth="0"
//               title="Google Form"
//             >
//               Loading…
//             </iframe>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }







import React, { useState } from "react";
const courses = [
  {
    title: "Well Being and Conscious Life",
    category: "Personal Development",
    description:
      "Develop holistic wellness through mindful living, spiritual growth, and balanced lifestyle practices.",
    image: "/images/Wellness.jpeg",
    duration: "6 Weeks",
    fees: "₹12,000",
    mode: "Online",
  },
  {
    title: "Holistic Governance and Administration",
    category: "Leadership",
    description:
      "Master the art of ethical leadership and comprehensive administrative practices for modern organizations.",
    image: "/images/Governor.jpeg",
    duration: "8 Weeks",
    fees: "₹15,000",
    mode: "Hybrid (Online + Workshop)",
  },
  {
    title: "AI",
    category: "Technology",
    description:
      "Explore the fascinating world of AI, machine learning, and their practical applications in various industries.",
    image: "/images/AI.jpeg",
    duration: "10 Weeks",
    fees: "₹18,000",
    mode: "Online",
  },
  {
    title: "Innovator",
    category: "Business",
    description:
      "Learn to cultivate creativity, problem-solving skills, and innovative thinking for real-world applications.",
    image: "/images/Innovator.jpeg",
    duration: "6 Weeks",
    fees: "₹14,000",
    mode: "Offline/Online",
  },
  {
    title: "Exporter",
    category: "Business",
    description:
      "Understand international trade, export strategies, and global market opportunities.",
    image: "/images/exporter.jpeg",
    duration: "8 Weeks",
    fees: "₹16,000",
    mode: "Online",
  },
  {
    title: "Tourism",
    category: "Industry",
    description:
      "Discover the dynamics of tourism industry and learn to create memorable travel experiences.",
    image: "/images/t1.jpg",
    duration: "6 Weeks",
    fees: "₹10,000",
    mode: "Hybrid",
  },
  
  {
    title: "Heritage Conservation",
    category: "Culture & History",
    description:
      "Learn to preserve and manage cultural heritage and historical sites.",
    image: "/heritage.jpg",
    duration: "6 Weeks",
    fees: "₹12,000",
    mode: "Online",
  },
  {
    title: "Intelligence Investigator",
    category: "Security & Investigation",
    description:
      "Develop skills in intelligence gathering, investigation techniques, and analytical reasoning.",
    image: "/images/Intelligence1.jpeg",
    duration: "8 Weeks",
    fees: "₹15,000",
    mode: "Offline/Online",
  },
];


// ✅ Common Google Form link
const googleFormLink =
  "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowForm(false);
  };

  return (
    <div className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Initial Course Offerings
        </h1>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Practical and immediate career-oriented courses designed to transform
          lives and build expertise in emerging fields.
        </p>

        {/* Courses List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="p-4 text-center flex flex-col flex-1">
                <p className="text-lg font-bold text-gray-900">{course.title}</p>
                 <p className="text-sm text-gray-500 mt-2">{course.category}</p>
                <p className="text-xs text-gray-600 mt-2">{course.description}</p>

                <button
                  onClick={() => openModal(course)}
                  className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            {/* Show course info or Google Form */}
            {!showForm ? (
              <>
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {selectedCourse.title}
                </h2>

                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Info</h3>
                    <p className="text-sm">{selectedCourse.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Duration</h3>
                    <p className="text-sm">{selectedCourse.duration}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Fees for Admission</h3>
                    <p className="text-sm">{selectedCourse.fees}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Mode</h3>
                    <p className="text-sm">{selectedCourse.mode}</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Proceed to Enroll
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Enrollment Form
                </h2>
                <iframe
                  src={googleFormLink}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="Google Form"
                >
                  Loading…
                </iframe>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}




// import { useState } from "react";
// import { useParams } from "react-router-dom";

// const courses = [
//   {
//     category: "Personal Development",
//     title: "Well Being and Conscious Life",
//     description: "Develop holistic wellness through mindful living.",
//     level: "Beginner to Advanced",
//     image: "/c2.avif",
//   },
//   {
//     category: "Leadership",
//     title: "Holistic Governance",
//     description: "Master the art of ethical leadership.",
//     level: "Intermediate",
//     image: "/leadership.jpg",
//   },
//   {
//     category: "Technology",
//     title: "Artificial Intelligence",
//     description: "Explore AI and machine learning applications.",
//     level: "All Levels",
//     image: "/ed11.jpg",
//   },
//   {
//     category: "Business",
//     title: "Innovation & Entrepreneurship",
//     description: "Transform ideas into ventures.",
//     level: "Intermediate",
//     image: "/business.jpg",
//   },
//   {
//     category: "Industry",
//     title: "Tourism & Hospitality",
//     description: "Discover the tourism industry.",
//     level: "Beginner",
//     image: "/tourism.jpg",
//   },
// ];

// export default function Courses({ hideHeader = false }) {
//   const { category } = useParams(); // ✅ get category from URL
//   const [selectedCategory, setSelectedCategory] = useState(
//     category ? category.replace("-", " ") : "All"
//   );

//   const categories = ["All", "Personal Development", "Leadership", "Technology", "Business", "Industry"];

//   const filteredCourses =
//     selectedCategory === "All"
//       ? courses
//       : courses.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());

//   return (
//     <section className="py-20 px-6 bg-gray-100">
//       <div className="max-w-7xl mx-auto text-center">
//         {/* ✅ Hide heading if opened from HomePage */}
//         {!hideHeader && (
//           <>
//             <h1 className="text-4xl font-bold mb-4 text-gray-900">
//               Initial Course Offerings
//             </h1>
//             <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
//               Practical and immediate career-oriented courses designed to transform
//               lives and build expertise in emerging fields and timeless wisdom traditions.
//             </p>
//           </>
//         )}

//         {/* ✅ Hide category buttons if coming from HomePage */}
//         {!hideHeader && (
//           <div className="flex flex-wrap justify-center gap-3 mb-16">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                   selectedCategory === cat
//                     ? "bg-black text-white"
//                     : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Courses Grid */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredCourses.map((course, i) => (
//             <div key={i} className="rounded-xl overflow-hidden shadow-md bg-white">
//               <img src={course.image} alt={course.title} className="w-full h-56 object-cover" />
//               <div className="p-4 text-center">
//                 <p className="text-lg font-bold text-gray-900">{course.title}</p>
//                 <p className="text-sm text-gray-500">{course.level}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
