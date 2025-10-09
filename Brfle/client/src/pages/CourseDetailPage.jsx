import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  PlayCircle,
  ArrowLeft,
  Shield,
  Award,
  Globe,
  Users,
  Star,
  BarChart3,
  Target,
  Calendar,
  Download,
  MessageCircle
} from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("Fetching course with ID:", id);
        
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Course not found");
          }
          throw new Error(`Failed to fetch course: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Course data received:", data);
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.message);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Mock reviews data - you can replace with actual API data
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment: "This course transformed my understanding of the subject. The instructor explains complex concepts in a very simple way.",
      avatar: "/images/avatar1.jpg"
    },
    {
      id: 2,
      name: "Rahul Kumar",
      rating: 4,
      date: "1 month ago",
      comment: "Great content and practical examples. The projects helped me build a strong portfolio.",
      avatar: "/images/avatar2.jpg"
    },
    {
      id: 3,
      name: "Anita Desai",
      rating: 5,
      date: "3 weeks ago",
      comment: "The course structure is excellent. I went from beginner to confident practitioner in just a few weeks.",
      avatar: "/images/avatar3.jpg"
    }
  ];

  // Dynamic features based on course data
  const getCourseFeatures = () => {
    const baseFeatures = [
      { icon: <PlayCircle size={20} />, text: "50+ Video Lessons" },
      { icon: <BookOpen size={20} />, text: "Downloadable Resources" },
      { icon: <Award size={20} />, text: "Certificate of Completion" },
      { icon: <Shield size={20} />, text: "Lifetime Access" },
      { icon: <Download size={20} />, text: "Exercise Files" },
      { icon: <MessageCircle size={20} />, text: "Q&A Support" },
    ];

    // Add mode-specific feature
    if (course?.mode?.toLowerCase().includes("online")) {
      baseFeatures.push({ icon: <Globe size={20} />, text: "Online Classes" });
    }
    if (course?.mode?.toLowerCase().includes("hybrid")) {
      baseFeatures.push({ icon: <Globe size={20} />, text: "Hybrid Learning" });
    }

    return baseFeatures;
  };

  // Dynamic learning outcomes based on course category
  const getLearningOutcomes = () => {
    const outcomes = {
      "Personal Development": [
        "Develop mindfulness and self-awareness techniques",
        "Create balanced lifestyle habits for holistic wellness",
        "Build emotional intelligence and resilience",
        "Master stress management and relaxation techniques",
        "Cultivate positive relationships and communication skills",
        "Achieve personal growth and life transformation"
      ],
      "Leadership": [
        "Master ethical leadership principles and practices",
        "Develop strategic decision-making capabilities",
        "Build effective team management and collaboration skills",
        "Learn comprehensive administrative best practices",
        "Enhance communication and conflict resolution abilities",
        "Create sustainable organizational growth strategies"
      ],
      "Technology": [
        "Understand core AI and machine learning concepts",
        "Develop practical AI implementation skills",
        "Build real-world AI applications and solutions",
        "Master data analysis and pattern recognition",
        "Learn to integrate AI into existing systems",
        "Stay updated with emerging AI technologies and trends"
      ]
    };

    return outcomes[course?.category] || [
      "Master fundamental concepts and principles",
      "Apply knowledge to real-world scenarios",
      "Develop practical skills through projects",
      "Build a professional portfolio",
      "Prepare for industry certifications",
      "Join a community of like-minded learners"
    ];
  };

  // Mock curriculum data
  const curriculum = [
    { module: "Module 1: Foundations", lessons: 8, duration: "4 hours" },
    { module: "Module 2: Core Concepts", lessons: 12, duration: "6 hours" },
    { module: "Module 3: Advanced Techniques", lessons: 10, duration: "5 hours" },
    { module: "Module 4: Real-world Projects", lessons: 6, duration: "8 hours" },
    { module: "Module 5: Certification Prep", lessons: 4, duration: "3 hours" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6 max-w-md">{error || "The course you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  const features = getCourseFeatures();
  const learningOutcomes = getLearningOutcomes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Courses</span>
            </button>
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {course.category}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {course.mode}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start gap-6 mb-6">
                {/* Course Image in Circle */}
                <div className="flex-shrink-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={20} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={20} />
                  <span>1,234 students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600">
                  <Star size={20} className="fill-current" />
                  <span>4.8 (256 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BarChart3 size={20} />
                  <span>All Levels</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Star size={16} />
                  View Reviews
                </button>
                <button
                  onClick={() => document.getElementById('curriculum-section').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Users size={16} />
                  See Curriculum
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-lg mb-8">
              <div className="border-b">
                <nav className="flex -mb-px">
                  {["overview", "curriculum", "reviews", "instructor"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                        activeTab === tab
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Course Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Target size={20} className="text-blue-600" />
                          What You'll Learn
                        </h4>
                        <div className="space-y-3">
                          {learningOutcomes.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BarChart3 size={20} className="text-blue-600" />
                          Course Features
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="text-blue-600">
                                {feature.icon}
                              </div>
                              <span className="text-gray-700">{feature.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div id="curriculum-section">
                    <h3 className="text-2xl font-bold mb-6">Course Curriculum</h3>
                    <div className="space-y-4">
                      {curriculum.map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-center">
                            <h5 className="font-semibold text-gray-900">{module.module}</h5>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>{module.lessons} lessons</span>
                              <span>{module.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div id="reviews-section">
                    <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={review.avatar}
                                alt={review.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <h5 className="font-semibold">{review.name}</h5>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">About the Instructor</h3>
                    <div className="flex items-start gap-6">
                      <img
                        src="/images/instructor.jpg"
                        alt="Instructor"
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <h4 className="text-xl font-semibold mb-2">Dr. Sarah Johnson</h4>
                        <p className="text-gray-600 mb-4">Senior Instructor & Industry Expert</p>
                        <p className="text-gray-700">
                          With over 10 years of experience in the field, Dr. Johnson has helped thousands of students 
                          achieve their career goals. Her practical approach to teaching combines theoretical knowledge 
                          with real-world applications.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Pricing Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      ₹{course.fees?.toLocaleString()}
                    </div>
                    <p className="text-gray-600">One-time payment</p>
                  </div>

                  <button
                    onClick={() => navigate(`/checkout/${course._id}`)}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg mb-4"
                  >
                    Buy Now
                  </button>

                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">30-day money-back guarantee</p>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Access on mobile </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>Direct instructor support</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t">
                  <p className="text-center text-sm text-gray-600">
                    🔒 Secure payment • Free updates
                  </p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-semibold mb-4">This course includes:</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium">40+ videos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skill Level</span>
                    <span className="font-medium">All Levels</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certificate</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>📧 support@brfle.com</p>
                  <p>📞 +91-9876543210</p>
                  <p>🕒 24/7 Support Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}