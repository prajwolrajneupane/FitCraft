import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentOptions = () => {
  const location = useLocation();
  const { modelUrl, designName } = location.state || {};

  const [showPermission, setShowPermission] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef();
  const [formData, setFormData] = useState(null);

  const handlePermissionResponse = async (allow) => {
    setShowPermission(false);

    if (allow && modelUrl) {
      try {
        await axios.post("http://localhost:5000/api/approved", {
          modelUrl,
          designName: designName || "Untitled Design", // ✅ use name from Details
          thumbnailUrl: "/uploads/defaultThumbnail.png", // or generate dynamically
        });
        console.log("Design approved and saved!");
      } catch (err) {
        console.error("Error saving approved design:", err);
      }
    }
  };

  const handleCOD = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleOther = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-6 relative">
      {showPermission && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/10">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center border border-gray-200">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              Can we use your design?
            </h2>
            <p className="text-gray-700 mb-6">
              We'd love to showcase and sell your design to other users. Do you
              allow us to use it?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePermissionResponse(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                Yes
              </button>
              <button
                onClick={() => handlePermissionResponse(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-purple-300 p-10 z-10">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
          Select Payment Method
        </h2>
        <div className="space-y-6">
          <button
            onClick={handleESewa}
            className="flex items-center justify-between w-full bg-gradient-to-r from-green-400 to-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <span className="text-lg font-semibold">Pay with eSewa</span>
          </button>

          <button
            onClick={handleCOD}
            className="flex items-center justify-between w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <span className="text-lg font-semibold">Cash on Delivery</span>
          </button>

          <button
            onClick={handleOther}
            className="flex items-center justify-between w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
            <span className="text-lg font-semibold">Other Payment Options</span>
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 text-purple-800 font-bold text-2xl px-12 py-6 rounded-2xl shadow-2xl animate-fade-in-out">
            Success
          </div>
        </div>
      )}

      {formData && (
        <form
          ref={formRef}
          action={formData.form_url}
          method="POST"
          style={{ display: "none" }}>
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
