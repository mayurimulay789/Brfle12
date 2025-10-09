import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";

// import CourseDetail from "./pages/CourseCategory.jsx";

import About from "./pages/about.jsx";
import Courses from "./pages/courses.jsx";
// import CourseInfo from "./pages/CourseInfo.jsx";
import CourseDetailPage from "./pages/CourseDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import Features from "./pages/features.jsx";
import GlobalPresence from "./pages/globalpresence.jsx";
import MyCoursesSection from './components/MyCoursesSection';
import Services from "./pages/services.jsx";
import UserDashboard from "./pages/UserDashboard";
import CourseForm from "./pages/CourseForm";

import RegistrationForm from "./components/RegistrationForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./components/Dashboard.jsx";

//import ConditionalDashboard from "./components/ConditionalDashboard.jsx";


import Chatbot from "./components/Chatbot.jsx";
 

function Home() {
  return (
    <>
      <Hero />
     
    </>
  );
}

function AboutPageGroup() {
  return (
    <>
      <About />
      <Features />
      {/* <GlobalPresence />
      <Services /> */}
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App scroll-smooth pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPageGroup />} /> {/* ✅ multiple sections */}
          <Route path="/features" element={<Features />} />
          <Route path="/services" element={<Services />} />
          <Route path="/globalpresence" element={<GlobalPresence />} />
         <Route path="/courses" element={<Courses />} /> {/* ✅ separate page */}
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin-panel" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/userdashboard" element={<UserDashboard />} />
           <Route path="/my-courses" element={<MyCoursesSection />} />
           <Route path="/course/:id" element={<CourseForm />} />
          
         
                  {/* <Route path="/courseinfo" element={<CourseInfo />} /> */}
        {/* <Route path="/courses/:category" element={<Courses hideHeader={true> />} /> */}
        </Routes>
      </div>
      <Footer />
      <Chatbot />
    </Router>
  );
}

export default App;



// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Footer from "./components/Footer";
// import About from "./pages/about";
// import Courses from "./pages/courses";
// import Features from "./pages/features";
// import Services from "./pages/services";
// import GlobalPresence from "./pages/globalpresence";

// function App() {
//   return (
//     <div className="bg-white text-black">
//       <Navbar />
//       <Hero />
//       <About />
//       <Courses />
//       <Features />
//       <Services />
//       <GlobalPresence />
//       <Footer />
//     </div>
//   );
// }

// export default App;
