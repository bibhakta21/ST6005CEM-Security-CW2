import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          Your payment was unsuccessful or canceled. Please try again or contact support if the problem persists.
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

export default PaymentFailure;
