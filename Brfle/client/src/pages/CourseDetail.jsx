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
  Download,
  MessageCircle,
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:5000/api/courses/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

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
          <p className="text-gray-600 mb-6 max-w-md">
            {error || "The course you're looking for doesn't exist."}
          </p>
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

  // Dynamic features
  const features = [
    { icon: <PlayCircle size={20} />, text: "High-quality video lessons" },
    { icon: <BookOpen size={20} />, text: "Downloadable resources" },
    { icon: <Award size={20} />, text: "Certificate of completion" },
    { icon: <Shield size={20} />, text: "Lifetime access" },
    { icon: <MessageCircle size={20} />, text: "Q&A Support" },
    { icon: <Download size={20} />, text: "Offline resources" },
    ...(course.mode?.toLowerCase().includes("online")
      ? [{ icon: <Globe size={20} />, text: "Online Classes" }]
      : []),
  ];

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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* =================== LEFT CONTENT =================== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start gap-6 mb-6">
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
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Dynamic Info */}
              <div className="flex flex-wrap gap-6 mb-4">
                {course.duration && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={20} />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.enrolledCount && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={20} />
                    <span>{course.enrolledCount} students enrolled</span>
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Star size={20} className="fill-current" />
                    <span>{course.rating.toFixed(1)} rating</span>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <BarChart3 size={20} />
                    <span>{course.level}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold mb-6">What This Course Offers</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-blue-600">{feature.icon}</div>
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> 

          {/* =================== SIDEBAR =================== */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Pricing Card */}
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
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Access on mobile & desktop</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Downloadable resources</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t">
                  <p className="text-center text-sm text-gray-600">
                    🔒 Secure payment • Free updates
                  </p>
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
