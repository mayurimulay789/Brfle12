// // src/components/Services.jsx
// import React from "react";
// import { Briefcase, Users, Headphones, Network, Target } from "lucide-react";

// const services = [
//   {
//     id: "01",
//     title: "Practical Experience",
//     description:
//       "Hands-on learning experiences that bridge theory and real-world application, ensuring you gain valuable skills that matter in your career.",
//     Icon: Briefcase,
//     image: "/ed8.avif", // ✅ Add image (put this in /public/services/)
//     points: [
//       "Live Projects",
//       "Skill Assessments",
//       "Industry Simulations",
//       "Practical Workshops",
//     ],
//   },
//   {
//     id: "02",
//     title: "Profession & Business Project Guidance",
//     description:
//       "Expert mentorship for professional development and business ventures, helping you navigate challenges and achieve your goals.",
//     Icon: Users,
//     image: "/ed9.avif",
//     points: [
//       "Business Planning",
//       "Project Management",
//       "Career Coaching",
//       "Strategic Guidance",
//     ],
//   },
//   {
//     id: "03",
//     title: "Support Systems",
//     description:
//       "Comprehensive support infrastructure to ensure your learning journey is smooth, effective, and continuously guided.",
//     Icon: Headphones,
//     image: "/ed13.avif",
//     points: [
//       "24/7 Help Desk",
//       "Technical Assistance",
//       "Academic Support",
//       "Personal Mentoring",
//     ],
//   },
//   {
//     id: "04",
//     title: "Connectivity with Concerns",
//     description:
//       "Direct connections with industry experts, institutions, and organizations relevant to your field of study and career aspirations.",
//     Icon: Network,
//     image: "/ed11.jpg",
//     points: [
//       "Industry Networks",
//       "Institutional Partnerships",
//       "Professional Connections",
//       "Expert Access",
//     ],
//   },
//   {
//     id: "05",
//     title: "Result & Outcome Oriented Systems",
//     description:
//       "Focused approach on measurable outcomes and tangible results that demonstrate your progress and achievement.",
//     Icon: Target,
//     image: "/ed12.avif",
//     points: [
//       "Progress Tracking",
//       "Performance Analytics",
//       "Outcome Measurement",
//       "Success Metrics",
//     ],
//   },
// ];

// export default function Services() {
//   return (
//     <section className="py-16 bg-gray-900">
//       {/* Heading */}
//       <div className="max-w-6xl mx-auto px-6 text-center mb-12">
//         <h2 className="text-3xl md:text-4xl font-extrabold text-amber-200">
//           Services & Solutions
//         </h2>
//         <p className="mt-3 text-gray-200 max-w-3xl mx-auto">
//           Comprehensive support and guidance systems designed to ensure your
//           success in every aspect of your learning and professional development
//           journey.
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="max-w-6xl mx-auto px-6 space-y-10">
//         {services.map((s, idx) => {
//           const isOdd = idx % 2 === 1;
//           return (
//             <div
//               key={s.id}
//               className={`flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition ${
//                 isOdd ? "md:flex-row-reverse" : ""
//               }`}
//             >
//               {/* Text side */}
//               <div className="md:w-1/2 bg-white p-8 flex flex-col justify-center">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="bg-green-100 p-3 rounded-lg">
//                     <s.Icon className="w-6 h-6 text-cyan-700" />
//                   </div>
//                   <span className="text-gray-400 font-bold">{s.id}</span>
//                 </div>

//                 <h3 className="text-2xl font-semibold text-cyan-800 mb-3">
//                   {s.title}
//                 </h3>
//                 <p className="text-gray-600 mb-6">{s.description}</p>

//                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 mb-4">
//                   {s.points.map((pt, i) => (
//                     <li key={i} className="flex items-start gap-2">
//                       <span className="mt-1 w-2 h-2 rounded-full bg-cyan-700 flex-shrink-0" />
//                       <span className="hover:shadow-md transition px-1 py-0.5 rounded">
//                         {pt}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 <button className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md font-medium transition">
//                   Learn More →
//                 </button>
//               </div>

//               {/* Image side */}
//               <div className="md:w-1/2 flex items-center justify-center p-10 bg-gradient-to-br from-blue-500/5 to-green-300/10">
//                 <img
//                   src={s.image}
//                   alt={s.title}
//                   className="max-h-64 object-contain rounded-xl"
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* CTA */}
//       <div className="max-w-5xl mx-auto px-6 mt-16">
//         <div className="rounded-2xl text-white py-12 px-8 bg-gradient-to-r from-teal-800 to-teal-700 shadow-md text-center">
//           <h3 className="text-2xl font-bold mb-2">
//             Ready to Experience Excellence?
//           </h3>
//           <p className="text-green-100 max-w-2xl mx-auto mb-6">
//             Join our comprehensive support system and transform your learning
//             journey with result-oriented solutions designed for your success.
//           </p>
//           <button className="bg-white text-black px-5 py-2 rounded-md font-semibold hover:bg-gray-200 transition inline-flex items-center gap-2 mx-auto">
//             Get Started Today →
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
// src/components/Services.jsx
import React from "react";

export default function Services() {
  return (
    <section className="py-16 bg-gray-900">
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-6 text-center py-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Services
        </h2>
        {/* Highlight Card */}
        <div className="max-w-4xl mx-auto px-6 mb-16 mt-12">
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 border-2 border-gray-300">
            <p className="text-gray-200 text-lg text-center">
              Our services empower learners with practical experience, mentorship,
              and support systems designed for success. By fostering global
              collaboration, innovation, and continuous learning, we prepare
              individuals to thrive in the evolving landscape of education and
              professional opportunities.
            </p>
          </div>
        </div>

      </div>

      {/* Services List Section */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h3 className="text-3xl font-semibold text-white text-center mb-5">
          Key Services:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 bg-white/10 p-5 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-yellow-400 text-2xl">★</span>
            <p className="text-gray-200 font-medium">
              Remote and convenient learning from anywhere
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white/10 p-5 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-yellow-400 text-2xl">★</span>
            <p className="text-gray-200 font-medium">
              Practical, hands-on education for real-life skills
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white/10 p-5 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-yellow-400 text-2xl">★</span>
            <p className="text-gray-200 font-medium">
              Flexible, self-paced online or offline courses
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white/10 p-5 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-yellow-400 text-2xl">★</span>
            <p className="text-gray-200 font-medium">
              Personal development and self-reliance training
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white/10 p-5 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-yellow-400 text-2xl">★</span>
            <p className="text-gray-200 font-medium">
              Career, business, and industry skill development
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white/10 p-5 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-yellow-400 text-2xl">★</span>
            <p className="text-gray-200 font-medium">
              Hassle-free and easy enrollment process
            </p>
          </div>
        </div>
      </div>

      {/* Image + Paragraph Blocks */}
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Block 1 */}
        <div>
          <img
            src="/images/hero1.jpg" // add image to /public
            alt="Service 1"
            className="w-full h-80 md:h-96 object-cover rounded-xl shadow-md"
          />
          <p className="text-gray-200 text-xl leading-relaxed mt-4 italic text-center drop-shadow-md">
            “At International Open Education, we provide global learners access
            to high-quality resources and practical learning experiences.
            Our mission is to bridge the gap between theory and real-world application,
            helping individuals acquire relevant, current, and impactful skills.”          </p>
        </div>

        {/* Block 2 */}
        <div>
          <img
            src="/images/hero2.jpg"
            alt="Service 2"
            className="w-full h-80 md:h-96 object-cover rounded-xl shadow-md"
          />
          <p className="text-gray-200 text-xl leading-relaxed mt-4 italic text-center drop-shadow-md">
            “Expert mentors and industry professionals guide learners through live projects,
            business ventures, and career development programs. By combining hands-on experience
            with strategic guidance, we empower individuals to confidently advance in their
            personal and professional growth.”          </p>
        </div>

        {/* Block 3 */}
        <div>
          <img
            src="/images/hero3.jpeg"
            alt="Service 3"
            className="w-full h-80 md:h-96 object-cover rounded-xl shadow-md"
          />
          <p className="text-gray-200 text-xl leading-relaxed mt-4 italic text-center drop-shadow-md">
            “A robust support system underpins every learning journey, offering academic assistance,
            technical help, and personalized mentoring. We ensure that every individual has the tools,
            knowledge, and guidance to achieve success.”          </p>
        </div>

      </div>

      {/* CTA Section */}
      {/* <div className="max-w-4xl mx-auto px-6 mt-20">
  <div className="rounded-2xl text-white py-16 px-10 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-700 shadow-xl text-center transform transition-all duration-500 hover:scale-105">
    <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
      Ready to Experience Excellence?
    </h3>
    <p className="text-green-100 max-w-2xl mx-auto mb-8 text-lg md:text-xl leading-relaxed">
      Join our comprehensive support system and transform your learning journey with result-oriented solutions designed for your success.
    </p>
    <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 hover:shadow-lg transition-transform transform hover:scale-105 inline-flex items-center gap-3 mx-auto">
      Get Started Today →
    </button>
  </div>
</div> */}
    </section>
  );
}