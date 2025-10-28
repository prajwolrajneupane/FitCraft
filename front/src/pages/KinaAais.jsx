import React from 'react'
import { Link } from 'react-router-dom';

function KinaAais() {
  return (
      <div className="min-h-screen bg-no-repeat bg-center bg-contain flex flex-col items-center justify-center "
            style={{ backgroundImage: "url('/anger.jpeg')" }}
          >
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-red-700 mb-4">No item selected</h1>
            <p className="text-gray-700 mb-6 text-center">Yeta kina aais? GHAR JA!</p>
            <button
              
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
              
              <Link to={"/"}>
              GHAR
              </Link>
            </button>
              </div>
          </div>
  )
}

export default KinaAais
