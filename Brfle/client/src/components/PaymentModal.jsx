import { useState } from "react";
import { CreditCard, X, Wallet } from "lucide-react";

export const PaymentModal = ({ isOpen, onClose, onOnline, onCOD, amount }) => {
  const [tab, setTab] = useState("online");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-96 overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setTab("online")}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              tab === "online"
                ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            💳 Pay Online
          </button>
          <button
            onClick={() => setTab("cod")}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              tab === "cod"
                ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            💵 Cash on Delivery
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {tab === "online" ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pay Online
              </h3>
              <p className="text-gray-600 mb-4">
                Proceed securely using Razorpay.
              </p>
              <p className="text-lg font-semibold mb-4 text-gray-800">
                Amount to Pay: ₹{amount}
              </p>
              <button
                className="flex items-center justify-center w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  onOnline();
                  onClose();
                }}
              >
                <CreditCard className="mr-2" size={18} /> Pay ₹{amount}
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cash on Delivery
              </h3>
              <p className="text-gray-600 mb-4">
                You’ll pay ₹{amount} when your learning kit or access is
                delivered.
              </p>
              <button
                className="flex items-center justify-center w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {
                  onCOD();
                  onClose();
                }}
              >
                <Wallet className="mr-2" size={18} /> Confirm COD
              </button>
            </>
          )}
        </div>

        {/* Close button */}
        <button
          className="absolute text-gray-500 top-3 right-3 hover:text-gray-900"
          onClick={onClose}
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
};
