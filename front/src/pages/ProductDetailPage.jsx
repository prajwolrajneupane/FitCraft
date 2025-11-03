import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 3D model preview component
function Luga({ URL, position = [0, 0, 0] }) {
  const gltf = useLoader(GLTFLoader, URL);
  return (
    <primitive
      object={gltf.scene}
      scale={[0.03, 0.03, 0.03]}
      position={position}
      rotation={[0, -1.4, 0]}
    />
  );
}

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { designId } = location.state || {};

  const [design, setDesign] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate random price (between Rs. 899–1599)
  const price = Math.floor(Math.random() * (1599 - 899 + 1)) + 899;

  // Format date
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleBuyNow = () => {
    navigate("/details", {
      state: {
        modelUrl: design.modelUrl,
        designName: design.designName,
      },
    });
  };
  console.log(designId);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
        <div className="flex items-center space-x-3 text-purple-700 text-xl font-semibold">
          <svg
            className="animate-spin h-6 w-6 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
              c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          Product not found 😢
        </h2>
        <Link
          to="/"
          className="text-lg text-white bg-purple-600 px-5 py-2 rounded-lg shadow-md hover:bg-purple-700 transition">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden flex flex-col lg:flex-row">
        {/* 3D Preview Section */}
        <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6">
          <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200">
            <Canvas camera={{ position: [0, 1, 2.5], fov: 45 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 10, 7]} intensity={1} />
              <Environment preset="sunset" />
              <OrbitControls enableZoom={true} />
              <Luga URL={design.modelUrl} />
            </Canvas>
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-purple-700 mb-4">
              {design.designName}
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              Crafted with care by{" "}
              <span className="font-semibold text-purple-600">
                {creator ? creator.name : "Unknown Creator"}
              </span>
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Published on: {formattedDate}
            </p>

            <p className="text-2xl font-bold text-purple-800 mb-6">
              Rs. {price}
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              This exclusive custom design was made by a talented creator in our
              community. You can preview it in 3D, order it in your preferred
              size, and get it delivered right to your doorstep. Own this design
              and wear your creativity with pride!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform hover:scale-105">
              Buy Now
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-full shadow-md text-center transition-transform hover:scale-105">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
