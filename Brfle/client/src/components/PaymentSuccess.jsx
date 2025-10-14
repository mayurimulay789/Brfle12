import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMyEnrollments } from "../store/slices/enrollmentSlice";
import { fetchMyPayments } from "../store/slices/paymentSlice";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { course, payment, enrollment, userDetails } = location.state || {};

  useEffect(() => {
    // Refresh enrollments and payments after successful payment
    dispatch(fetchMyEnrollments());
    dispatch(fetchMyPayments());
  }, [dispatch]);

  if (!course) {
    navigate("/courses");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for enrolling in {course.courseTitle}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold mb-4">Enrollment Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Course:</span>
                <span className="font-medium">{course.courseTitle}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-medium">{userDetails?.fullName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userDetails?.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">₹{payment?.amount?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-sm">{payment?.paymentId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-sm">{payment?.orderId}</span>
              </div>
              
              {enrollment && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrollment Date:</span>
                  <span className="font-medium">
                    {new Date(enrollment.enrolledAt || new Date()).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• You will receive a confirmation email shortly</li>
              <li>• Course materials are available in your dashboard</li>
              <li>• Our team will contact you for onboarding within 24 hours</li>
              <li>• Check your email for login credentials and access instructions</li>
              <li>• Join our student community for discussions and support</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/my-courses")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Go to My Courses
            </button>
            
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Browse More Courses
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{" "}
              <a href="mailto:support@brfle.com" className="text-blue-600 hover:underline">
                support@brfle.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}