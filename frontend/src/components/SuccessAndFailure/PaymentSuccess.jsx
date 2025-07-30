import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const encodedData = query.get("data");

  let orderId = "";
  let amount = "";
  let cardEnding = "";

  try {
    const decoded = encodedData ? JSON.parse(atob(encodedData)) : null;
    if (decoded) {
      orderId = decoded.orderId || orderId;
      amount = decoded.amount || amount;
      cardEnding = decoded.cardEnding || cardEnding;
    }
  } catch (err) {
    console.error("Error decoding eSewa response");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful</h2>

        <p className="text-gray-500 mb-6">
          Thank you for your payment. Your order will be processed shortly.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
