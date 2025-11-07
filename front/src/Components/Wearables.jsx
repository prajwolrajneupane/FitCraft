import React from "react";
import { Link } from "react-router-dom";

const items = [
  // IMPORTANT: Items without a 'threeD' model cannot be customized in 3D.
  // The recommendation system relies on the 'category' key, which we derive from 'name'.
  { name: "T-Shirt", image: "/blackT.png", threeD: "/tshirt.glb" },
  { name: "Hoodie", image: "/hoodie.png", threeD: "/hoodie.glb" },
  { name: "Cap", image: "/cap.png", threeD: "/cap.glb" },
  { name: "Shirt", image: "/shirt.png", threeD: "/shirtt.glb" },
];

export default function Wearables() {
  const handleSelect = (item) => {
    console.log(`Selected item: ${item.name}`);
  };

  return (
    <div className="min-h-screen w-full py-16 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-32 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text- mb-4 font-coda text-black/50  ">
          Start <span className="text-teal-500"> designing</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {items.map((item) =>
            // Only allow navigation if a 3D model exists
            item.threeD ? (
              <Link
                to={`/Canvas/${item.name}`}
                // --- KEY CHANGE HERE ---
                // We spread the original item and add a 'category' field
                // using the item.name, satisfying the DesignerApp component.
                state={{ ...item, category: item.name }}
                key={item.name}>
                <div
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white rounded-3xl shadow-lg hover:shadow-xl hover:border-indigo-400 transition-all duration-500 p-6 flex flex-col items-center h-full transform hover:-translate-y-2 group-hover:scale-102 relative overflow-hidden">
                  <div className="relative w-full h-36 mb-4 flex justify-center items-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                    {item.name}
                  </span>
                </div>
              </Link>
            ) : (
              // Non-clickable item if no 3D model is available for design
              <div
                key={item.name}
                className="opacity-50 cursor-not-allowed bg-white bg-opacity-10 border border-opacity-10 border-white rounded-3xl shadow-md p-6 flex flex-col items-center h-full">
                <div className="relative w-full h-36 mb-4 flex justify-center items-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-500">
                  {item.name}
                </span>
                <span className="text-xs text-red-400 mt-1">
                  (Model Missing)
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
