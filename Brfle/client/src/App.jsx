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
import CourseDetail from "./pages/CourseDetail";
import Checkout from './pages/Checkout';
import Features from "./pages/features.jsx";
import GlobalPresence from "./pages/globalpresence.jsx";
import Services from "./pages/services.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyProfile from './pages/MyProfile';
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import MyCourses from "./components/MyCourses.jsx";
import Chatbot from "./components/Chatbox.jsx";
import WatchCourse from "./components/WatchCourse.jsx";
import ReadCourseBook from "./components/ReadCourseBook.jsx";
import ReadProjectBook from "./components/ReadProjectBook.jsx";
import McqQuestions from "./components/McqQuestions.jsx";
import GenerateCertificate from "./components/GenerateCertificate.jsx";

// Import the new components
import QuestionAnswer from "./components/QuestionAnswer.jsx";
import CourseProgress from "./components/CourseProgress.jsx";
import ExperienceDiary from "./components/ExperienceDiary.jsx";

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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/payment-success" element={<PaymentSuccess/>} />
          <Route path="/my-courses" element={<MyCourses />} />

          {/* Course Learning Routes with Points System */}
          <Route 
            path="/course/:courseId/course-progress" 
            element={
              <ProtectedRoute>
                <CourseProgress />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:courseId/watch" 
            element={
              <ProtectedRoute>
                <WatchCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:courseId/course-book" 
            element={
              <ProtectedRoute>
                <ReadCourseBook />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/course/:courseId/project-book"
            element={
              <ProtectedRoute>
                <ReadProjectBook />
              </ProtectedRoute>
            }
            />
          <Route
            path="/course/:courseId/attempt-test"
            element={
              <ProtectedRoute>
                <McqQuestions />
              </ProtectedRoute>
            }
            />
          <Route
            path="/course/:courseId/experience"
            element={
              <ProtectedRoute>
                <ExperienceDiary />
              </ProtectedRoute>
            }
            />
          <Route
            path="/course/:courseId/certificate"
            element={
              <ProtectedRoute>
                <GenerateCertificate />
              </ProtectedRoute>
            }
            />
          <Route 
            path="/course/:courseId/qa" 
            element={
              <ProtectedRoute>
                <QuestionAnswer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:courseId/videos" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Videos</h1>
                    <div className="grid gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Content</h3>
                        <p className="text-gray-600 mb-4">
                          Complete all video lessons to earn 20 points for this section.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 text-sm">
                            🎯 <strong>20 Points Available</strong> - Watch all course videos and complete the video quizzes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:courseId/pdfs" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">PDF Books & Materials</h1>
                    <div className="grid gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Reading Materials</h3>
                        <p className="text-gray-600 mb-4">
                          Read all PDF materials and complete the reading assignments to earn 20 points.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 text-sm">
                            🎯 <strong>20 Points Available</strong> - Complete all reading assignments and PDF exercises.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:courseId/projects" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Project Books</h1>
                    <div className="grid gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Hands-on Projects</h3>
                        <p className="text-gray-600 mb-4">
                          Complete all practical projects and submit your work to earn 20 points.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 text-sm">
                            🎯 <strong>20 Points Available</strong> - Finish all projects and get them approved by instructors.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* ✅ Protected Routes (Require Authentication) */}
          <Route 
            path="/admin-panel" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      <Footer />
      <Chatbot />
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