import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;

  const [showSuccess, setShowSuccess] = useState(false);

  if (!formData) {
    navigate('/');
    return null;
  }

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleEsewa = () => {
    triggerSuccess();
  };

  const handleCOD = () => {
    triggerSuccess();
  };

  const handleOther = () => {
    triggerSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-6 relative">
      {/* Payment Box */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-purple-300 p-10 z-10">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
          Select Payment Method
        </h2>

        <div className="space-y-6">
          <button
            onClick={handleEsewa}
            className="flex items-center justify-between w-full bg-gradient-to-r from-green-400 to-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
          >
            <span className="text-lg font-semibold">Pay with eSewa</span>
          </button>

          <button
            onClick={handleCOD}
            className="flex items-center justify-between w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
          >
            <span className="text-lg font-semibold">Cash on Delivery</span>
          </button>

          <button
            onClick={handleOther}
            className="flex items-center justify-between w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
          >
            <span className="text-lg font-semibold">Other Payment Options</span>
          </button>
        </div>
      </div>

      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 text-purple-800 font-bold text-2xl px-12 py-6 rounded-2xl shadow-2xl animate-fade-in-out">
            Success
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
