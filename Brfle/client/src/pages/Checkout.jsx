import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { ArrowLeft, CreditCard, CheckCircle, Clock, Users, BookOpen } from "lucide-react";
=======
import { ArrowLeft, CreditCard, CheckCircle, Users, Star, Clock } from "lucide-react";
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
import { useDispatch, useSelector } from "react-redux";
import {
  createPaymentOrder,
  verifyPayment,
  resetPaymentState,
} from "../store/slices/paymentSlice";
import { fetchCourse } from "../store/slices/courseSlice";
import { PaymentModal } from "../components/PaymentModal";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { order, loading, error } = useSelector((state) => state.payment);
  const { courses } = useSelector((state) => state.courses);
=======
  
  // Redux state
  const { order, loading, error, verificationLoading } = useSelector((state) => state.payment);
  const { currentCourse, loading: courseLoading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // ✅ Fetch course details
  useEffect(() => {
<<<<<<< HEAD
    if (!id) {
      navigate("/courses");
      return;
    }
    
    const fetchCourse = async () => {
      try {
        // First try to get from Redux store
        const courseFromStore = courses?.find(c => c._id === id);
        
        if (courseFromStore) {
          setCourse(courseFromStore);
        } else {
          // Fallback to API call
          const res = await fetch(`http://localhost:5000/api/courses/${id}`);
          const data = await res.json();
          setCourse(data);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        navigate("/courses");
      }
    };
    
    fetchCourse();
  }, [id, navigate, courses]);
=======
    if (id) {
      dispatch(fetchCourse(id));
    }
  }, [id, dispatch]);

  // ✅ Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setBillingInfo(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || "",
        lastName: user.name?.split(' ').slice(1).join(' ') || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342

  // ✅ Form Handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
    // Clear error when user starts typing
    if (formErrors[name]) {
<<<<<<< HEAD
      setFormErrors({ ...formErrors, [name]: "" });
=======
      setFormErrors(prev => ({ ...prev, [name]: '' }));
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!billingInfo.firstName.trim()) errors.firstName = "First name is required";
    if (!billingInfo.lastName.trim()) errors.lastName = "Last name is required";
    if (!billingInfo.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(billingInfo.email)) errors.email = "Email is invalid";
    if (!/^\d{10}$/.test(billingInfo.phone))
      errors.phone = "Enter a valid 10-digit phone number";
    if (!billingInfo.address.trim()) errors.address = "Address is required";
    if (!billingInfo.city.trim()) errors.city = "City is required";
    if (!billingInfo.state.trim()) errors.state = "State is required";
    if (!billingInfo.zipCode.trim()) errors.zipCode = "ZIP code is required";
    if (!termsAccepted) errors.terms = "You must accept terms & policies";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Handle Modal Open
  const handlePaymentStart = () => {
    if (!validateForm()) return;
    setIsModalOpen(true);
  };

  // ✅ Handle Razorpay Online Payment
  const handleOnlinePayment = async () => {
    try {
<<<<<<< HEAD
      const userId = localStorage.getItem("userId") || "dummyUserId";
      const orderData = await dispatch(createOrder({ 
        courseId: id, 
        userId,
        courseDetails: course,
        billingInfo 
      })).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BRFLE Academy",
        description: course.title,
        order_id: orderData.id,
        handler: async (response) => {
          const verifyRes = await dispatch(verifyPayment({
            ...response,
            courseId: id,
            billingInfo
          })).unwrap();
          if (verifyRes.success) {
            alert("Payment successful!");
            dispatch(resetPayment());
            navigate("/success", { 
              state: { 
                course: course,
                orderId: response.razorpay_order_id 
              } 
            });
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: `${billingInfo.firstName} ${billingInfo.lastName}`,
          email: billingInfo.email,
          contact: billingInfo.phone,
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
=======
      // Create payment order
      await dispatch(createPaymentOrder(id)).unwrap();
      
      // Razorpay will be handled in the PaymentModal component
      setIsModalOpen(false);
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
    } catch (err) {
      console.error("Payment initiation failed:", err);
    }
  };

<<<<<<< HEAD
  // ✅ Handle Cash on Delivery
  const handleCODPayment = () => {
    alert("Cash on Delivery order placed successfully!");
    navigate("/success", { 
      state: { 
        course: course,
        paymentMethod: "COD"
=======
  // ✅ Handle successful payment (called from PaymentModal)
  const handlePaymentSuccess = () => {
    dispatch(resetPaymentState());
    navigate("/my-courses", { 
      state: { 
        message: "Payment successful! You are now enrolled in the course.",
        courseId: id 
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
      } 
    });
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // Calculate pricing
  const courseFee = Number(course.price) || 0;
  const discount = courseFee * 0.1; // 10% discount
  const total = courseFee - discount;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate("/courses")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE - Course Information & Billing */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Details</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {course.category && (
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-600" />
                        <span className="text-gray-700">{course.category}</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-green-600" />
                        <span className="text-gray-700">{course.duration}</span>
                      </div>
                    )}
                    {course.level && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-purple-600" />
                        <span className="text-gray-700">{course.level}</span>
                      </div>
                    )}
                    {course.mode && (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-orange-600" />
                        <span className="text-gray-700">{course.mode}</span>
                      </div>
                    )}
=======
  if (!currentCourse) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <button 
            onClick={() => navigate("/courses")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const courseFee = Number(currentCourse.price) || 0;
  const discount = courseFee > 0 ? courseFee * 0.1 : 0; // 10% discount
  const total = courseFee - discount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} /> Back to Course
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your enrollment in {currentCourse.courseTitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE - Course & Billing Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Summary */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Details</h2>
              <div className="flex gap-4">
                <img
                  src={currentCourse.courseImage?.url || '/api/placeholder/300/200'}
                  alt={currentCourse.courseTitle}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {currentCourse.courseTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {currentCourse.courseSummary}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{currentCourse.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{currentCourse.totalStudents || 0} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{currentCourse.averageRating || 'New'}</span>
                    </div>
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Information */}
<<<<<<< HEAD
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
=======
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                Billing Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
<<<<<<< HEAD
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "address",
                  "city",
                  "state",
                  "zipCode",
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium capitalize mb-2">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      name={field}
                      value={billingInfo[field]}
                      onChange={handleChange}
                      placeholder={`Enter your ${field.replace(/([A-Z])/g, " $1")}`}
                      className={`border p-3 rounded-lg outline-none transition-colors ${
                        formErrors[field] 
                          ? "border-red-500 bg-red-50" 
                          : "border-gray-300 focus:border-blue-500 focus:bg-blue-50"
                      }`}
                    />
                    {formErrors[field] && (
                      <span className="text-red-500 text-xs mt-1">
                        {formErrors[field]}
=======
                  { key: "firstName", label: "First Name", required: true },
                  { key: "lastName", label: "Last Name", required: true },
                  { key: "email", label: "Email Address", required: true, type: "email" },
                  { key: "phone", label: "Phone Number", required: true },
                  { key: "address", label: "Address", required: true, fullWidth: true },
                  { key: "city", label: "City", required: true },
                  { key: "state", label: "State", required: true },
                  { key: "zipCode", label: "ZIP Code", required: true },
                ].map((field) => (
                  <div 
                    key={field.key} 
                    className={field.fullWidth ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.key}
                      value={billingInfo[field.key]}
                      onChange={handleChange}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors[field.key] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors[field.key] && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {formErrors[field.key]}
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
<<<<<<< HEAD
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
=======
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                <select
                  name="country"
                  value={billingInfo.country}
                  onChange={handleChange}
<<<<<<< HEAD
                  className="border border-gray-300 p-3 rounded-lg w-full focus:border-blue-500 focus:bg-blue-50 outline-none"
=======
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <div className="flex items-start mt-6">
                <input
                  type="checkbox"
                  checked={termsAccepted}
<<<<<<< HEAD
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 mr-3 mt-1"
                />
                <span className="text-gray-700 text-sm">
                  I agree to the{" "}
                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                    Privacy Policy
                  </span>
                </span>
              </div>
              {formErrors.terms && (
                <p className="text-red-500 text-xs mt-2 ml-8">{formErrors.terms}</p>
=======
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (formErrors.terms) {
                      setFormErrors(prev => ({ ...prev, terms: '' }));
                    }
                  }}
                  className="w-4 h-4 mt-1 mr-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                    Privacy Policy
                  </a>
                </span>
              </div>
              {formErrors.terms && (
                <p className="text-red-500 text-xs mt-2">{formErrors.terms}</p>
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
              )}
            </section>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <aside className="space-y-6">
            {/* Order Summary */}
<<<<<<< HEAD
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                Order Summary
              </h2>
              
              <div className="space-y-3 text-gray-700 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Course Fee</span>
                  <span className="font-semibold">₹{courseFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount (10%)</span>
                  <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
=======
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Course Fee</span>
                  <span className="font-medium">₹{courseFee.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                </div>
              </div>

              <button
                onClick={handlePaymentStart}
<<<<<<< HEAD
                disabled={loading || !termsAccepted}
                className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                  termsAccepted
=======
                disabled={loading || verificationLoading}
                className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                  termsAccepted && !loading && !verificationLoading
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
<<<<<<< HEAD
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${total.toLocaleString()}`
                )}
              </button>
              
              {error && (
                <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
              )}

              <div className="mt-4 text-center">
                <CreditCard size={20} className="inline text-gray-400 mr-2" />
                <span className="text-xs text-gray-500">Secure payment powered by Razorpay</span>
=======
                {loading ? "Creating Order..." : 
                 verificationLoading ? "Processing..." : 
                 `Pay ₹${total.toFixed(2)}`}
              </button>
              
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Security Badges */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-center space-x-6 opacity-60">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6"/>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6"/>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6"/>
                  <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-6"/>
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">
                  256-bit SSL secured payment
                </p>
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
              </div>
            </div>

            {/* What's Included */}
<<<<<<< HEAD
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
=======
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                What's Included
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  "Instant enrollment after payment",
                  "Lifetime access to course materials",
                  "Certificate of completion",
                  "Downloadable resources and projects",
                  "Community support access",
<<<<<<< HEAD
                  "Q&A sessions with instructors",
                  "Regular course updates",
=======
                  "30-day money-back guarantee",
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle
                      size={16}
                      className="text-green-500 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Need Help?</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  <span>support@brfle.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+91-9876543210</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>🕒</span>
                  <span>24/7 Support Available</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOnline={handleOnlinePayment}
<<<<<<< HEAD
        onCOD={handleCODPayment}
        amount={total.toFixed(2)}
        courseName={course.title}
=======
        amount={total}
        course={currentCourse}
        billingInfo={billingInfo}
        onPaymentSuccess={handlePaymentSuccess}
        order={order}
        loading={loading || verificationLoading}
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
      />
    </div>
  );
}