import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  CreditCard, 
  Lock,
  FileText,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN"
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({
      ...billingInfo,
      [name]: value
    });
  };

  const handlePayment = async () => {
    // Validate all required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !billingInfo[field]);
    
    if (missingFields.length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions to proceed");
      return;
    }

    setProcessing(true);
    
    try {
      // Create order with courseId instead of amount
      const res = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id }),
      });
      
      if (!res.ok) throw new Error("Failed to create order");
      
      const order = await res.json();

      const options = {
        key: "rzp_live_zpW8DRz71kgfGe", // 🔑 Replace with your Razorpay Key
        amount: order.amount,
        currency: order.currency,
        name: "BRFLE Academy",
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        handler: async function (response) {
          // Verify payment on your server
          const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          
          const verification = await verifyRes.json();
          
          if (verification.success) {
            alert("🎉 Payment Successful! You are now enrolled in the course.");
            navigate("/courses");
          } else {
            alert("❌ Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${billingInfo.firstName} ${billingInfo.lastName}`,
          email: billingInfo.email,
          contact: billingInfo.phone,
        },
        notes: {
          course: course.title,
          courseId: id,
          address: billingInfo.address,
          city: billingInfo.city,
          state: billingInfo.state,
          zipCode: billingInfo.zipCode,
          country: billingInfo.country
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("❌ Failed to process payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = billingInfo.firstName && billingInfo.lastName && billingInfo.email && 
                     billingInfo.phone && billingInfo.address && billingInfo.city && 
                     billingInfo.state && billingInfo.zipCode && termsAccepted;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Course</span>
            </button>
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method - MOVED TO TOP */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Payment Method</h2>
              <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Razorpay Secure Payment</p>
                    <p className="text-sm text-gray-600">
                      Credit/Debit Card, UPI, Net Banking, Wallets
                    </p>
                  </div>

                  {/* Real-looking symbols without installation */}
                  <div className="flex space-x-3">
                    {/* Visa */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="h-7 w-9"
                    >
                      <rect width="48" height="48" fill="#1a1f71" rx="4" />
                      <text
                        x="24"
                        y="32"
                        textAnchor="middle"
                        fill="white"
                        fontFamily="Arial, sans-serif"
                        fontWeight="bold"
                        fontSize="16"
                      >
                        VISA
                      </text>
                    </svg>

                    {/* MasterCard */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="h-7 w-8"
                    >
                      <rect width="48" height="48" fill="white" rx="4" />
                      <circle cx="20" cy="24" r="11" fill="#eb001b" />
                      <circle cx="28" cy="24" r="11" fill="#f79e1b" />
                    </svg>

                    {/* UPI */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="h-7 w-8"
                    >
                      <rect width="54" height="48" fill="#4caf50" rx="4" />
                      <text
                        x="24"
                        y="32"
                        textAnchor="middle"
                        fill="white"
                        fontFamily="Arial, sans-serif"
                        fontWeight="bold"
                        fontSize="16"
                      >
                        UPI
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Billing Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">First Name *</label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleBillingInfoChange}
                      className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      pattern="^[A-Za-z\s]+$"
                      title="First name should only contain letters."
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={billingInfo.lastName}
                    onChange={handleBillingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    pattern="^[A-Za-z\s]+$"
                    title="Last name should only contain letters."
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={billingInfo.email}
                      onChange={handleBillingInfoChange}
                      className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      title="Enter a valid email address."
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleBillingInfoChange}
                      className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      pattern="^[0-9]{10}$"
                      maxLength={10}
                      title="Enter a valid 10-digit phone number."
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Address *</label>
                  <div className="relative">
                    <MapPin className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleBillingInfoChange}
                      className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleBillingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    pattern="^[A-Za-z\s]+$"
                    title="City should only contain letters."
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={billingInfo.state}
                    onChange={handleBillingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    pattern="^[A-Za-z\s]+$"
                    title="State should only contain letters."
                  />
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={billingInfo.zipCode}
                    onChange={handleBillingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    pattern="^[0-9]{5,6}$"
                    title="Enter a valid 5 or 6 digit ZIP Code."
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Country *</label>
                  <select
                    name="country"
                    value={billingInfo.country}
                    onChange={handleBillingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>

                {/* Terms and Conditions inside billing */}
                <div className="md:col-span-2 mt-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="/terms" className="text-blue-600 underline hover:text-blue-800">
                        Terms of Service
                      </a>
                      ,{" "}
                      <a href="/privacy" className="text-blue-600 underline hover:text-blue-800">
                        Privacy Policy
                      </a>
                      , and{" "}
                      <a href="/refund" className="text-blue-600 underline hover:text-blue-800">
                        Refund Policy
                      </a>
                      . I understand that I will have immediate access to this course upon successful payment.
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>

          {/* Order Summary & Features */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                {/* Course Info */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.duration}</p>
                    <p className="text-sm text-gray-600">{course.mode}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Fee</span>
                    <span className="font-semibold">₹{course.fees?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="text-gray-600">₹{(course.fees * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total Amount</span>
                    <span>₹{(course.fees * 1.18).toLocaleString()}</span>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing || !isFormValid}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Pay with Razorpay
                    </>
                  )}
                </button>
              </div>

              {/* Features Section - SEPARATED */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">What's Included</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Instant enrollment after payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Lifetime access to course materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Community support access</span>
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