import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 3D model viewer component
function Luga({ URL }) {
  const gltf = useLoader(GLTFLoader, URL);
  return (
    <primitive
      object={gltf.scene}
      scale={[0.03, 0.03, 0.03]}
      position={[0, -1, 0]}
      rotation={[0, -1.4, 0]}
    />
  );
}

function BuyNow() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get designId from navigation state
  const modelUrl = state?.modelUrl;

  useEffect(() => {
    if (!modelUrl) {
      setError("No design selected.");
      setLoading(false);
      return;
    }

    const fetchDesign = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/approved/${designId}`
        );
        setDesign(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching design:", err);
        setError("Failed to load design details.");
        setLoading(false);
      }
    };
    fetchDesign();
  }, [designId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
        <p className="text-purple-700 font-semibold text-xl">
          Loading design...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <p className="text-red-700 font-semibold text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col lg:flex-row gap-8">
        {/* 3D Preview */}
        <div className="w-full lg:w-1/2 h-[400px] border rounded-xl overflow-hidden">
          <Canvas camera={{ position: [0, 1, 2.5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 7]} intensity={1} />
            <Environment preset="sunset" />
            <OrbitControls enableZoom enablePan={false} />
            <Luga URL={design.modelUrl} />
          </Canvas>
        </div>

        {/* Design Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {design.designName || "Untitled Design"}
            </h1>
            <p className="text-gray-500">
              Created by:{" "}
              <span className="font-semibold text-purple-700">
                {design.creatorName || "Unknown"}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Category:</span>{" "}
              {design.category || "Custom Apparel"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Material:</span>{" "}
              {design.material || "Premium Cotton"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Price:</span>{" "}
              <span className="text-green-600 font-bold text-xl">
                ${design.price || 24.99}
              </span>
            </p>
            {design.description && (
              <p className="text-gray-600 mt-4">{design.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => alert("Purchase Confirmed!")}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
              Confirm Purchase
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;
