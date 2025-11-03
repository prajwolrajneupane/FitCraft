import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Luga from "./Luga";
import KinaAais from "./KinaAais.jsx";

// 💡 Using a minimal icon for the design name modal (Heroicons style)
const PencilIcon = () => (
  <svg
    className="w-6 h-6 text-indigo-500 mx-auto mb-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
  </svg>
);

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { modelUrl } = location.state || {};

  // ✅ Stop if no model selected
  if (!modelUrl) return <KinaAais />;

  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [wantsToName, setWantsToName] = useState(false);
  const [designName, setDesignName] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    preferredSize: "",
    quantity: 1,
  });

  const handleDesignNameSubmit = () => {
    setShowNamePrompt(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/payment-options", {
      state: {
        modelUrl,
        designName: designName.trim() || "Untitled Design", // ✅ pass design name
      },
    });
  };

  return (
    // Minimal background with soft slate color
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">
      {/* 📝 Design Name Modal (Minimal & Elegant) */}
      {showNamePrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform scale-100 transition duration-300 border border-gray-100">
            {!wantsToName ? (
              <>
                <PencilIcon />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Name Your Creation?
                </h2>
                <p className="mb-6 text-gray-500 text-sm">
                  Give your unique design a name for easy reference in your
                  orders.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setWantsToName(true)}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-md">
                    Yes, Name It
                  </button>
                  <button
                    onClick={() => setShowNamePrompt(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">
                    Skip
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Enter Design Name
                </h2>
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="My Custom T-Shirt"
                  // Clean input style
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleDesignNameSubmit}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition w-full font-semibold shadow-md"
                  disabled={!designName.trim()}>
                  Save & Continue
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🛒 Main Form + Preview (Minimal Card) */}
      {!showNamePrompt && (
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 border border-gray-100 z-0 grid md:grid-cols-2 gap-8">
          {/* Left Side: 3D Preview */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
              Design Preview
            </h2>
            {modelUrl && (
              <div className="w-full max-w-xs h-80 bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                <Canvas camera={{ position: [0, 0, 2.5] }}>
                  <ambientLight intensity={0.9} />
                  <OrbitControls enableZoom={false} />
                  <Luga URL={modelUrl} />
                </Canvas>
              </div>
            )}

            {/* Design Name Display */}
            {designName.trim() && (
              <div className="mt-4 text-center font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg text-sm border border-indigo-200">
                Design Name: <span className="font-bold">{designName}</span>
              </div>
            )}
          </div>

          {/* Right Side: Customer Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight border-b pb-2">
              Shipping & Order Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone & Address */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                // Minimal input style
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Shipping Address (Street/House No.)"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              {/* City, State, ZIP */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State/Province"
                  value={formData.state}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <input
                type="text"
                name="zip"
                placeholder="ZIP / Postal Code"
                value={formData.zip}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              {/* Size & Quantity */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <select
                  name="preferredSize"
                  value={formData.preferredSize}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  required>
                  <option value="" disabled>
                    Select Size
                  </option>
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                </select>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Submit Button (Primary Accent) */}
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg mt-6">
                Submit Details & Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
