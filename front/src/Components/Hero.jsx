import React from "react";
import { Link } from "react-router-dom";
import background from "/background.png";

function Hero() {
  return (
    <div
      className="h-[780px] w-full bg-cover bg-no-repeat bg-center relative flex justify-center items-center flex-col gap-8"
      style={{ backgroundImage: `url(${background})` }}>
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10 pointer-events-none backdrop-blur-sm"></div>

      {/* Title */}
      <h1 className="z-20 text-6xl md:text-7xl font-extrabold tracking-wide flex items-center gap-2">
        <span className="text-teal-500 ">Fit</span>
        <span className="text-white ">Craft</span>
      </h1>

      {/* Tagline */}
      <p className="z-20 text-white/90 text-center text-sm md:text-lg lg:text-xl max-w-2xl leading-relaxed px-4">
        Design your dream wearables using creative tools — from drawing and
        image uploads to AI-generated art. Express your style effortlessly.
      </p>

      {/* Button */}
      <Link to="/Wearables" className="z-20">
        <button className="rounded-full py-4 px-10 bg-blue-400 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
          Create Now
        </button>
      </Link>

      {/* Decorative glowing border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00BFFF] via-white to-[#9810FA] opacity-70 blur-sm"></div>
    </div>
  );
}

export default Hero;
