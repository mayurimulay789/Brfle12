// // About.jsx
// import React from "react";
// import { Heart, Lightbulb, Target, Quote } from "lucide-react";

// const features = [
//   {
//     icon: Heart,
//     title: "Wholesome Development",
//     description:
//       "Creating self-sufficient, self-proficient, and self-illuminating individuals through comprehensive educational experiences.",
//   },
//   {
//     icon: Lightbulb,
//     title: "Practical Wisdom",
//     description:
//       "Emphasizing practical education that brings lasting changes in conduct and life, eliminating various deficiencies through enhanced understanding.",
//   },
//   {
//     icon: Target,
//     title: "Global Accessibility",
//     description:
//       "Making quality education accessible to everyone, everywhere, breaking traditional barriers and creating opportunities for continuous empowerment.",
//   },
// ];

// export default function About() {
//   return (
//     <div className="bg-gray-900 text-gray-700">
//       <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
//         {/* Mission Section */}
//         <section className="text-center space-y-6">
//           <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-amber-200 mb-4">
//             Our Sacred Mission
//           </h2>

//           <p className="text-gray-200 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
//             Inspired by the eternal wisdom of Y P Baba, BRFLE embodies prosperity,
//             wholesome progress, and sacred illumination through transformative
//             education.
//           </p>

//           {/* Quote Card - same alignment as features */}
//           <div className="max-w-5xl mx-auto">
//             <div className="relative">
//               {/* Left green bar */}
//               <span className="absolute left-0 top-4 bottom-4 w-1 bg-cyan-900 rounded-r-md shadow-sm"></span>

//               {/* Card */}
//               <div className="bg-white rounded-xl shadow-md p-8 md:p-12 border border-green-100">
//                 <div className="flex items-start gap-4">
//                   <div className="mt-1">
//                     <Quote className="text-cyan-900" size={22} />
//                   </div>
//                   <blockquote className="text-lg md:text-xl text-gray-800 italic leading-relaxed text-left">
//                     "One should refrain from inefficiency. The real character
//                     (Sheel) lies in the right attitude of doing efficient acts and
//                     noble actions. The life becomes simple, straight and natural
//                     with studies... refined conduct and behaviour is the result of
//                     right education."
//                   </blockquote>
//                 </div>
//                 <div className="mt-6 text-left">
//                   <cite className="text-cyan-900 not-italic text-left">
//                     — Y P Baba, Eternal Inspiration of BRFLE
//                   </cite>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Features Section - same alignment as quote card */}
//         <section>
//           <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//             {features.map((feature, idx) => {
//               const Icon = feature.icon;
//               return (
//                 <div
//                   key={idx}
//                   className="bg-white p-8 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1 text-center"
//                 >
//                   <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
//                     <Icon className="text-cyan-700" size={28} />
//                   </div>
//                   <h3 className="text-lg md:text-xl text-cyan-900 mb-3">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm md:text-base leading-relaxed">
//                     {feature.description}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* Vision Section */}
//         <section className="text-center">
//           <div className="bg-white rounded-xl p-12 shadow-sm max-w-5xl mx-auto">
//             <h3 className="text-3xl md:text-3xl text-cyan-900 mb-4">
//               The BRFLE Vision
//             </h3>
//             <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
//               To enable each individual to learn and grow with opportunity for
//               progress and self-development. BRFLE brings education to you at
//               your home or anywhere, creating wholesome personalities for the new
//               age through practical, result-oriented learning experiences that are
//               free from hassles and obstacles, welcoming everyone to achieve their
//               full potential.
//             </p>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }








import React from "react";


const cards = [
  {
    title: "Mission",
    desc: "To empower individuals with global opportunities, fostering holistic growth, creativity, and leadership across diverse communities.",
    img: "/images/p1.jpeg",
  },
  {
    title: "Vision",
    desc: "To become a beacon of innovation and excellence, enabling people to thrive and lead in an ever-changing world.",
    img: "/images/p3.jpeg",
  },
  {
    title: "Core Values",
    desc: "Integrity, inclusiveness, sustainability, and lifelong learning form the foundation of everything we do at BRFLE.",
    img: "/images/p2.jpeg",
  },
];

export default function AboutBRFLE() {
  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      <main className="flex-1">
        {/* About Section */}
        <section className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
            {/* Heading Section */}
            <div className="text-center space-y-4 mb-5">
              <h1 className="text-4xl md:text-5xl font-bold">About BRFLE</h1>
            </div>
           {/* Full About Story */}
<div className="relative bg-gray-300 text-gray-700 rounded-2xl p-10 shadow-lg space-y-6 mb-8 ">
  
  {/* Decorative blur circle */}
  <div className="absolute -top-10 -left-10 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl"></div>
  <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl"></div>

  <p >
    BRFLE International Open Education was informally announced on 26th August 2025, the day of Ganesh Chaturthi, marking the beginning of a vision to provide global open learning opportunities. BRFLE embodies prosperity, wholesome progress, and the illumination of knowledge.
  </p>
  <p>
    Inspired by Y P Baba, BRFLE follows the principle that true character arises from efficiency, noble actions, and the pursuit of refined conduct. With the right approach to learning, knowledge is gained, understanding is enhanced, skills are strengthened, and personal growth becomes natural and sustainable.
  </p>
  <p>
    The modern world requires education that is accessible, practical, and flexible. BRFLE’s open and distance learning platform brings education to your home or anywhere, emphasizing hands-on experience that fosters lasting changes in conduct and capability. Our courses are designed to cultivate self-sufficiency, proficiency, and independent thinking.
  </p>
  <p>
    Our programs include: Well-Being and Conscious Life, Holistic Governance and Administration, Artificial Intelligence, Innovation & Entrepreneurship, Export & Trade, Tourism, Heritage Conservation, Intelligence Investigation.
  </p>
  <p>
    Guided by experienced experts, teachers, and facilitators, BRFLE ensures that every learner gains practical skills, insights, and knowledge applicable in real life. Our global network spans India (Mumbai, Nashik, Pune, Delhi, Goa, Darjeeling) and internationally (Dubai, Netherlands, Florida).
  </p>
  <p>
    At BRFLE, everyone has the opportunity to learn, grow, and realize their full potential, guided by the principles of efficiency, ethics, and lifelong learning.
  </p>

  {/* Optional underline accent */}
  <div className="w-24 h-1 bg-cyan-400 mx-auto mt-4 rounded-full opacity-80"></div>
</div>
            {/* Philosophy Section */}
            <div className="relative bg-gray-500 text-white rounded-2xl p-10 shadow-2xl overflow-hidden">
              {/* Decorative accent circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

              <h2 className="text-2xl md:text-5xl font-bold text-center text-black-800 mb-6 drop-shadow-lg">
                Our Philosophy
              </h2>

              <p className="text-white text-xl leading-relaxed text-center max-w-4xl mx-auto ">
                BRFLE International Open Education is built on the belief that knowledge should be practical, flexible, and universally accessible. We value self-reliance, inclusiveness, and lifelong growth, bringing learning to people wherever they are. By blending global opportunities with real-world experience, BRFLE seeks to create independent, self-proficient and self-illuminating lives — nurturing progress, innovation, and ethical conduct in every sphere.
              </p>

              {/* Optional underline accent */}
              <div className="w-24 h-1 bg-white mx-auto mt-6 rounded-full opacity-70"></div>
            </div>

            {/* Mission / Vision / Core Values Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="relative rounded-lg overflow-hidden shadow-lg group transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                    <h3 className="text-white text-2xl font-semibold mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-200 text-sm">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>


        </section>
      </main>

      {/* Footer */}

    </div>
  );
}