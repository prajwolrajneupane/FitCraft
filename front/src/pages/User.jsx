import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Canvas, useLoader } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Luga component remains unchanged
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

function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user info:', err);
        setError(err.response?.data?.message || 'Failed to fetch user info');
        setLoading(false);
      });
  }, []);

  // Handler for the "Buy Again" button click
  const handleBuyAgain = (modelName) => {
    alert(`Initiating purchase for: ${modelName}`);
    // In a real application, you would integrate with your e-commerce or
    // payment processing logic here, passing 'modelName' or a model ID.
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
        <div className="flex items-center space-x-3 text-purple-700 text-xl font-semibold">
          <svg className="animate-spin h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 border border-purple-200">
        {/* User Profile Header */}
        <div className="flex flex-col items-center mb-12 border-b pb-8 border-gray-200">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center shadow-xl text-white text-7xl font-extrabold select-none ring-4 ring-purple-300 ring-offset-2">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <h1 className="mt-8 text-5xl font-extrabold text-gray-900 tracking-tight text-center">
            {user.name}
          </h1>
          <p className="mt-3 text-gray-600 text-xl font-medium">{user.email}</p>
          <p className="mt-2 text-sm text-gray-500 italic">Welcome back to your profile!</p>
        </div>

        {/* Purchased Items Section */}
        <section>
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center relative">
            Your Purchased Designs
            <span className="block w-24 h-1 bg-purple-500 mx-auto mt-3 rounded-full"></span>
          </h2>

          {user.model && user.model.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {user.model.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden
                             transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                             cursor-pointer group relative"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <Canvas
                    camera={{ position: [0, 1, 2.5], fov: 45 }}
                    style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
                  >
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 10, 7]} intensity={1} />
                    <Environment preset="sunset" />
                    <OrbitControls enableZoom={true} enablePan={false} minDistance={1.5} maxDistance={4} />
                    <Luga URL={`http://localhost:5000/uploads/${item}`} />
                  </Canvas>
                  {/* "Buy Again" Button Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4
                                  flex justify-center items-center
                                  bg-gradient-to-t from-black/60 to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent canvas click events
                        handleBuyAgain(item); // Pass the model's filename/identifier
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full
                                 shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
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
