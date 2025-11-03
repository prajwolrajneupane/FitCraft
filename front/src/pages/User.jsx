import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Renders a 3D model using the passed URL
function Luga({ URL, position = [0, 0, 0] }) {
  // aja ko date dekhauna

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

function User() {
  const purchaseDate = new Date(); // current date
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = purchaseDate.toLocaleDateString("en-US", options);
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        setError(err.response?.data?.message || "Failed to fetch user info");
        setLoading(false);
      });
  }, []);

  const handleBuyAgain = (modwal) => {
    Navigate("/details", (modwal = { modwal }));
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    Navigate("/login");
  };

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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading user info...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-rose-200">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm">
          <p className="text-red-600 font-semibold text-lg mb-4">Error:</p>
          <p className="text-gray-700">{error}</p>
          <Link to="/login">
            <h2 className="text-xl font-bold text-center text-purple-700 mb-6 border-2 rounded-2xl m-3 p-2">
              Login
            </h2>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 border border-purple-200 relative">
        {/* Back & Logout buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <Link
            to="/"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full shadow-sm transition">
            ← Back
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-sm transition">
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center mb-12 border-b pb-8 border-gray-200">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center shadow-xl text-white text-7xl font-extrabold select-none ring-4 ring-purple-300 ring-offset-2">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <h1 className="mt-8 text-5xl font-extrabold text-gray-900 tracking-tight text-center">
            {user.name}
          </h1>
          <p className="mt-3 text-gray-600 text-xl font-medium">{user.email}</p>
          <p className="mt-2 text-sm text-gray-500 italic">
            Welcome back to your profile!
          </p>
        </div>

        {/* Purchased Items */}
        <section>
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center relative">
            Your Purchased Designs
            <span className="block w-24 h-1 bg-purple-500 mx-auto mt-3 rounded-full"></span>
          </h2>

          {user.models && user.models.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {user.models.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex flex-col justify-between">
                  {/* 3D Thumbnail */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                    <Canvas
                      camera={{ position: [0, 1, 2.5], fov: 45 }}
                      style={{ width: "100%", height: "100%" }}>
                      <ambientLight intensity={0.8} />
                      <directionalLight position={[5, 10, 7]} intensity={1} />
                      <Environment preset="sunset" />
                      <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        minDistance={1.5}
                        maxDistance={4}
                      />
                      <Luga
                        URL={`http://localhost:5000/uploads/${item.model}`}
                      />
                    </Canvas>
                  </div>

                  {/* Info Section */}
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.modelName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Purchased on: {formattedDate}
                    </p>
                    <p className="mt-1 text-md font-bold text-purple-600">
                      Rs. 999
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyAgain(item.modelName);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-full
                                 shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                      Buy Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 p-8 bg-purple-50 rounded-xl text-center shadow-inner border border-purple-200">
              <p className="text-2xl text-purple-700 font-medium italic">
                You haven't purchased any designs yet.
              </p>
              <p className="mt-4 text-gray-600">
                Explore our collection to find your next favorite design!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default User;
