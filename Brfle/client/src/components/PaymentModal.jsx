import { useState } from "react";
import { CreditCard, X, Mail, CheckCircle } from "lucide-react";

export const PaymentModal = ({ isOpen, onClose, onOnline, amount, selectedCourseId, courseTitle, userEmail }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', null

  // Get userId from localStorage
  const getUserId = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return null;
      const user = JSON.parse(storedUser);
      return user._id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  const userId = getUserId();

  if (!isOpen) return null;

  // Function to send enrollment email
  const sendEnrollmentEmail = async (paymentMethod) => {
    try {
      const emailResponse = await fetch("http://localhost:5000/api/email/send-enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userEmail: userEmail,
          courseId: selectedCourseId,
          courseTitle: courseTitle,
          amount: amount,
          paymentMethod: paymentMethod,
          paymentDate: new Date().toISOString(),
        }),
      });

      const emailData = await emailResponse.json();

      if (emailResponse.ok) {
        console.log("Enrollment email sent successfully");
        return true;
      } else {
        console.error("Failed to send enrollment email:", emailData);
        return false;
      }
    } catch (error) {
      console.error("Error sending enrollment email:", error);
      return false;
    }
  };

  // Function to handle Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      // Check if user is logged in
      if (!userId) {
        alert("Please log in to make a payment.");
        return;
      }

      setLoading(true);
      setPaymentStatus(null);

      // 1️⃣ Create Razorpay order on backend
      const response = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to create order'}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.id) {
        alert("Failed to create order. Try again.");
        setLoading(false);
        return;
      }

      // 2️⃣ Configure Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount, // already in paise
        currency: data.currency || "INR",
        order_id: data.id,
        name: "BRFLE Academy",
        description: `Course: ${courseTitle}`,
        image: "/logo.png",
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: selectedCourseId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setPaymentStatus('success');

              // Send enrollment email
              const emailSent = await sendEnrollmentEmail("online");

              if (emailSent) {
                console.log("Payment successful and email sent!");
              } else {
                console.log("Payment successful but email failed to send");
              }

              // Call the success callback
              onOnline();

              // Auto close after 3 seconds
              setTimeout(() => {
                onClose();
                setPaymentStatus(null);
              }, 3000);

            } else {
              setPaymentStatus('error');
              alert("Payment verification failed!");
              setLoading(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus('error');
            alert("Payment verification failed!");
            setLoading(false);
          }
        },
        prefill: {
          name: "Student",
          email: userEmail || "student@example.com",
          contact: "+911234567890",
        },
        notes: {
          course: courseTitle,
          courseId: selectedCourseId,
        },
        theme: {
          color: "#2563eb",
        },
      };

      // 3️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setPaymentStatus('error');
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

    } catch (error) {
      console.error("Razorpay payment error:", error);
      setPaymentStatus('error');
      alert("Something went wrong with payment. Try again.");
      setLoading(false);
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg w-96 p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          You have been enrolled in <strong>{courseTitle}</strong>
        </p>
        <div className="flex items-center justify-center text-green-600 mb-4">
          <Mail className="h-5 w-5 mr-2" />
          <span className="text-sm">Enrollment confirmation sent to your email</span>
        </div>
        <button
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => {
            onClose();
            setPaymentStatus(null);
          }}
        >
          Continue Learning
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Success Message Overlay */}
      {paymentStatus === 'success' && <SuccessMessage />}

      {/* Payment Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white rounded-lg w-96 max-w-[95vw]">
          {/* Header */}
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Complete Your Enrollment</h3>
            <p className="text-sm text-gray-600 mt-1">Course: {courseTitle}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Amount Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">₹{amount}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="h-4 w-4 mr-2" />
                Secure payment via Razorpay
              </div>

              <button
                className="flex items-center justify-center w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRazorpayPayment}
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay ₹{amount}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};
