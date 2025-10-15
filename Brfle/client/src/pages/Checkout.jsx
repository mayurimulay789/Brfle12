import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment, recordPaymentFailure } from "../store/slices/paymentSlice";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { course, order, razorpayKey } = location.state || {};
  const { user } = useSelector((state) => state.auth);
  const { loading: paymentLoading, error: paymentError } = useSelector((state) => state.payments);

  const [formData, setFormData] = useState({
    fullName: user?.FullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!course || !order) {
      navigate("/courses");
    }
  }, [course, order, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.phone.match(/^\d{10}$/)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setProcessing(true);

    try {
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load. Please check your connection.");
        setProcessing(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "BRFLE Academy",
        description: `Enrollment for ${course.courseTitle}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const result = await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })).unwrap();

            navigate("/payment-success", {
              state: {
                course: course,
                payment: result.payment,
                enrollment: result.enrollment,
                userDetails: formData
              }
            });
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          course: course.courseTitle,
          courseId: course._id,
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: async () => {
            await dispatch(recordPaymentFailure({
              razorpay_order_id: order.id,
              error: { reason: 'Payment cancelled by user' }
            }));
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Payment processing failed. Please try again.");
      setProcessing(false);
    }
  };

  if (!course || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Checkout Session</h2>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const coursePrice = course.price || 15000;
  const gst = Math.round(coursePrice * 0.18);
  const totalAmount = coursePrice + gst;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your enrollment for {course.courseTitle}</p>
        </div>

        {paymentError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {paymentError}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Course Summary */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Course Details</h2>
              
              <div className="flex space-x-4">
                <img
                  src={course.courseImage?.url || "/default-course.jpg"}
                  alt={course.courseTitle}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{course.courseTitle}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.category}</p>
                  <p className="text-sm text-gray-600">{course.duration}</p>
                  <p className="text-sm text-gray-600">{course.mode}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Course Fees</span>
                  <span className="font-semibold">₹{coursePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Order Information</h4>
                <p className="text-sm text-blue-800">Order ID: {order.id}</p>
                <p className="text-sm text-blue-800">Amount: ₹{(order.amount / 100).toLocaleString()}</p>
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Student Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter PIN code"
                      maxLength="6"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePayment}
                    disabled={processing || paymentLoading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing || paymentLoading 
                      ? "Processing..." 
                      : `Pay ₹${totalAmount.toLocaleString()}`}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/courses")}
                    className="w-full mt-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">What's Included</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Full course access for {course.duration || "lifetime"}</li>
            <li>✅ Course materials and resources</li>
            <li>✅ Certificate of completion</li>
            <li>✅ Instructor support</li>
            <li>✅ Lifetime access to course updates</li>
            <li>✅ 30-day money-back guarantee</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your payment is secure and encrypted. We use Razorpay for safe transactions.
          </p>
        </div>
      </div>
    </div>
  );
}