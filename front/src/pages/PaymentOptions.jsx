import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// 💡 Using a minimal icon for the permission modal (using Heroicons style for simplicity)
const DocumentCheckIcon = () => (
  <svg
    className="w-8 h-8 text-teal-600 mx-auto mb-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

// 💡 Icon for eSewa (A simple check/payment icon)
const CreditCardIcon = () => (
  <svg
    className="w-5 h-5 mr-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
  </svg>
);

// 💡 Icon for COD (A simple cash icon)
const CashIcon = () => (
  <svg
    className="w-5 h-5 mr-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1L21 8a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2v-7a2 2 0 012-2h12.401c.519-.598 1.489-1 2.599-1z"></path>
  </svg>
);

// 💡 Icon for Other Payment (A simple dots menu icon)
const DotsIcon = () => (
  <svg
    className="w-5 h-5 mr-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
  </svg>
);

const PaymentOptions = () => {
  const location = useLocation();
  const { modelUrl, designName } = location.state || {};

  const [showPermission, setShowPermission] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef();
  const [formData, setFormData] = useState(null);

  // --- Functions (logic unchanged) ---

  const handlePermissionResponse = async (allow) => {
    setShowPermission(false);

    if (allow && modelUrl) {
      try {
        await axios.post("http://localhost:5000/api/approved", {
          modelUrl,
          designName: designName || "Untitled Design",
          thumbnailUrl: "/uploads/defaultThumbnail.png",
        });
        console.log("Design approved and saved!");
      } catch (err) {
        console.error("Error saving approved design:", err);
      }
    }
  };

  const showTemporarySuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCOD = showTemporarySuccess;

  const handleOther = showTemporarySuccess;

  const handleESewa = async () => {
    const amount = "100";
    const tax_amount = "10";
    const product_service_charge = "0";
    const product_delivery_charge = "0";
    const total_amount = (
      Number(amount) +
      Number(tax_amount) +
      Number(product_service_charge) +
      Number(product_delivery_charge)
    ).toFixed(2);
    const transaction_uuid = `txn-${Date.now()}`;
    const product_code = "EPAYTEST";

    try {
      const res = await axios.post(
        "http://localhost:5000/api/generate-signature",
        {
          amount,
          tax_amount,
          product_service_charge,
          product_delivery_charge,
          total_amount,
          transaction_uuid,
          product_code,
        }
      );

      setFormData({
        ...res.data,
        amount,
        tax_amount,
        product_service_charge,
        product_delivery_charge,
        total_amount,
        transaction_uuid,
        product_code,
        success_url: `${window.location.origin}/esewa-success`,
        failure_url: `${window.location.origin}/esewa-failure`,
      });

      setTimeout(() => formRef.current.submit(), 200);
    } catch (err) {
      console.error("ESewa signature error:", err);
    }
  };

  // --- Component JSX (Design Updated) ---
  return (
    // Minimal background with subtle gradient
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">
      {/* 📜 Permission Modal (Minimal & Clean) */}
      {showPermission && (
        // Darker, subtle overlay
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-xs text-center transform scale-100 transition duration-300 border border-gray-100">
            <DocumentCheckIcon />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Feature Your Design?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We'd love to sell this design to others. Do you grant us
              permission?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handlePermissionResponse(true)}
                // Minimal primary button
                className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition duration-200 shadow-md">
                Allow
              </button>
              <button
                onClick={() => handlePermissionResponse(false)}
                // Minimal secondary button
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition duration-200">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💳 Payment Options Card (Minimal & Focused) */}
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg border border-gray-100 p-8 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 tracking-tight">
          Select Payment Method
        </h2>
        <div className="space-y-4">
          {/* eSewa Button (Teal Accent + Border) */}
          <button
            onClick={handleESewa}
            className="flex items-center w-full bg-white text-teal-700 px-5 py-4 rounded-xl font-semibold shadow-sm border border-teal-200 hover:bg-teal-50 hover:shadow-md transition duration-200 ease-in-out">
            <CreditCardIcon />
            <span className="text-base text-gray-700">eSewa</span>
            <span className="ml-auto text-teal-600 text-sm font-bold">
              Recommended
            </span>
          </button>

          {/* COD Button (Soft Gray + Border) */}
          <button
            onClick={handleCOD}
            className="flex items-center w-full bg-white text-gray-700 px-5 py-4 rounded-xl font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition duration-200 ease-in-out">
            <CashIcon />
            <span className="text-base">Cash on Delivery (COD)</span>
          </button>

          {/* Other Options Button (Flat/Minimal) */}
          <button
            onClick={handleOther}
            className="flex items-center w-full bg-white text-gray-500 px-5 py-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition duration-200 ease-in-out">
            <DotsIcon />
            <span className="text-base">Other Payment Options</span>
          </button>
        </div>
      </div>

      {/* ✅ Success Message (Minimal Toast) */}
      {showSuccess && (
        <div className="absolute top-8 right-8 z-50">
          <div className="bg-white text-teal-600 border border-teal-300 font-medium px-6 py-3 rounded-lg shadow-xl animate-fade-in-down">
            <span className="font-bold mr-2">✅</span> Success!
          </div>
        </div>
      )}

      {/* Hidden eSewa Form - No Styling Changes Needed */}
      {formData && (
        <form
          ref={formRef}
          action={formData.form_url}
          method="POST"
          style={{ display: "none" }}>
          {/* ... (hidden inputs remain the same) ... */}
          <input type="hidden" name="amount" value={formData.amount} />
          <input type="hidden" name="tax_amount" value={formData.tax_amount} />
          <input
            type="hidden"
            name="product_service_charge"
            value={formData.product_service_charge}
          />
          <input
            type="hidden"
            name="product_delivery_charge"
            value={formData.product_delivery_charge}
          />
          <input
            type="hidden"
            name="total_amount"
            value={formData.total_amount}
          />
          <input
            type="hidden"
            name="transaction_uuid"
            value={formData.transaction_uuid}
          />
          <input
            type="hidden"
            name="product_code"
            value={formData.product_code}
          />
          <input
            type="hidden"
            name="signed_field_names"
            value={formData.signed_field_names}
          />
          <input type="hidden" name="signature" value={formData.signature} />
          <input
            type="hidden"
            name="success_url"
            value={formData.success_url}
          />
          <input
            type="hidden"
            name="failure_url"
            value={formData.failure_url}
          />
          <noscript>
            <button type="submit">Continue to eSewa</button>
          </noscript>
        </form>
      )}
    </div>
  );
};

export default PaymentOptions;
