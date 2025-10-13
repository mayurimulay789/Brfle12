import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  verifyPayment,
  resetPayment,
} from "../store/slices/paymentSlice";
import { PaymentModal } from "../components/PaymentModal";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.payment);

  const [course, setCourse] = useState(null);
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
    if (!id) return;
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
        navigate("/courses");
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // ✅ Form Handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!billingInfo.firstName.trim()) errors.firstName = "First name is required";
    if (!billingInfo.email.trim()) errors.email = "Email is required";
    if (!/^\d{10}$/.test(billingInfo.phone))
      errors.phone = "Enter a valid 10-digit phone number";
    if (!billingInfo.address.trim()) errors.address = "Address is required";
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
      const userId = localStorage.getItem("userId") || "dummyUserId";
      const orderData = await dispatch(createOrder({ courseId: id, userId })).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BRFLE Academy",
        description: course.title,
        order_id: orderData.id,
        handler: async (response) => {
          const verifyRes = await dispatch(verifyPayment(response)).unwrap();
          if (verifyRes.success) {
            alert("Payment successful!");
            dispatch(resetPayment());
            navigate("/courses");
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
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment.");
    }
  };

  // ✅ Handle Cash on Delivery
  const handleCODPayment = () => {
    alert("Cash on Delivery order placed successfully!");
    navigate("/courses");
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  const courseFee = Number(course.fees) || 0;
  const discount = courseFee * 0.1;
  const total = courseFee - discount;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-6xl p-5">
        <button
          onClick={() => navigate(`/courses`)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} /> Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Method */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 border-b pb-2">Payment Method</h2>
              <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 flex items-center space-x-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-lg">Razorpay Secure Payment</p>
                  <p className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                </div>
                <div className="flex space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6"/>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6"/>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6"/>
                </div>
              </div>
            </section>

            {/* Billing Information */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 border-b pb-2">
                Billing Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "address",
                  "city",
                  "state",
                  "zipCode",
                ].map((f) => (
                  <div key={f} className="flex flex-col">
                    <label className="text-gray-600 text-sm capitalize mb-1">
                      {f.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      name={f}
                      value={billingInfo[f]}
                      onChange={handleChange}
                      placeholder={`Enter your ${f}`}
                      className={`border p-3 rounded-lg outline-none ${
                        formErrors[f] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors[f] && (
                      <span className="text-red-500 text-xs mt-1">
                        {formErrors[f]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">Country</label>
                <select
                  name="country"
                  value={billingInfo.country}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg w-full"
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                </select>
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 mr-2"
                />
                <span className="text-gray-700 text-sm">
                  I agree to the{" "}
                  <span className="text-blue-600 underline cursor-pointer">
                    Terms & Conditions
                  </span>
                </span>
              </div>
              {formErrors.terms && (
                <p className="text-red-500 text-xs mt-1">{formErrors.terms}</p>
              )}
            </section>
          </div>

          {/* RIGHT SIDE */}
          <aside className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">
                Order Summary
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Course Fee</span>
                  <span>₹{courseFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount (10%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePaymentStart}
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-lg mt-6 transition-colors ${
                  termsAccepted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </button>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                What's Included
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  "Instant enrollment after payment",
                  "Lifetime access to course materials",
                  "Certificate of completion",
                  "30-day money-back guarantee",
                  "Downloadable resources",
                  "Community support access",
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
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Need Help?</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>📧 support@brfle.com</p>
                <p>📞 +91-9876543210</p>
                <p>🕒 24/7 Support Available</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ✅ Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOnline={handleOnlinePayment}
        onCOD={handleCODPayment}
        amount={total.toFixed(2)}
      />
    </div>
  );
}
