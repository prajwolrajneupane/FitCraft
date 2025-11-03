import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Luga from "./Luga";
import KinaAais from "./KinaAais.jsx";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 flex items-center justify-center p-6 relative">
      {/* Design Name Modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/10">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
            {!wantsToName ? (
              <>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">
                  Would you like to name your design?
                </h2>
                <p className="mb-4 text-gray-600">
                  This helps you organize your orders better.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setWantsToName(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                    Yes
                  </button>
                  <button
                    onClick={() => setShowNamePrompt(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                    No
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">
                  Enter a name for your design
                </h2>
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="My Custom T-Shirt"
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg shadow-sm mb-4"
                />
                <button
                  onClick={handleDesignNameSubmit}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition w-full"
                  disabled={!designName.trim()}>
                  Save & Continue
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Form + Preview */}
      {!showNamePrompt && (
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 border border-purple-200 z-0">
          <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
            Customer Details
          </h2>

          {/* 3D Preview */}
          {modelUrl && (
            <div className="w-full flex justify-center mb-6">
              <div className="w-64 h-64 bg-gray-100 border border-purple-300 rounded-xl overflow-hidden">
                <Canvas camera={{ position: [0, 0, 2.5] }}>
                  <ambientLight intensity={0.9} />
                  <OrbitControls enableZoom={false} />
                  <Luga URL={modelUrl} />
                </Canvas>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {designName && (
              <div className="text-center font-medium text-purple-600 bg-purple-100 py-2 rounded-md">
                Design Name: <span className="font-bold">{designName}</span>
              </div>
            )}

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
                required
              />
            </div>
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                name="preferredSize"
                value={formData.preferredSize}
                onChange={handleChange}
                className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
                required>
                <option value="">Select Size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
              </select>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md">
              Submit Details & Choose Payment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Details;
