import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 3D model renderer
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

function Page2() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage (assuming login saves it)
  const token = localStorage.getItem("token");

  // ✅ Handle Buy Now click
  const handleBuyNow = async (item) => {
    if (!token) return alert("Please login first!");

    // Split design name into keywords
    const keywords = item.designName
      ? item.designName.toLowerCase().split(" ")
      : [];

    try {
      await axios.post(
        "http://localhost:5000/api/user/keywords",
        { keywords },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/buy-now", { state: { designId: item._id } });
    } catch (err) {
      console.error("Error saving keywords:", err);
    }
  };

  // Fetch approved designs
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/approved");
        setDesigns(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching approved designs:", err);
        setError("Failed to load approved designs.");
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
        <p className="text-purple-700 font-semibold text-xl">
          Loading designs...
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
          Available Designs
          <span className="block w-24 h-1 bg-purple-500 mx-auto mt-3 rounded-full"></span>
        </h1>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex flex-col justify-between">
                {/* 3D Canvas */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                  <Canvas
                    camera={{ position: [0, 1, 2.5], fov: 45 }}
                    style={{ width: "100%", height: "100%" }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 10, 7]} intensity={1} />
                    <Environment preset="sunset" />
                    <OrbitControls
                      enableZoom
                      enablePan={false}
                      minDistance={1.5}
                      maxDistance={4}
                    />
                    <Luga URL={item.modelUrl} />
                  </Canvas>
                </div>

                {/* Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.designName || "Untitled Design"}
                  </h3>
                </div>

                {/* Buy Now Button */}
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg mt-10 text-center">
            No approved designs available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Page2;
