import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store";
import { getCurrentUser } from "./store/slices/authSlice";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import About from "./pages/about.jsx";
import Courses from "./pages/courses.jsx";
import Features from "./pages/features.jsx";
import GlobalPresence from "./pages/globalpresence.jsx";
import Services from "./pages/services.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Home Component
function Home() {
  return (
    <>
      <Hero />
    </>
  );
}

// About Page Group
function AboutPageGroup() {
  return (
    <>
      <About />
      <Features />
    </>
  );
}

// App Content (Redux connected component)
function AppContent() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  // ✅ Check if user is logged in on app start
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <div className="App scroll-smooth pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPageGroup />} />
          <Route path="/features" element={<Features />} />
          <Route path="/services" element={<Services />} />
          <Route path="/globalpresence" element={<GlobalPresence />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          
          {/* ✅ Protected Routes (Require Authentication) */}
          <Route 
            path="/admin-panel" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Add more protected routes as needed */}
          {/* <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

// Main App Component with Redux Provider
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;