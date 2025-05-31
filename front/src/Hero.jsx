import React from 'react';
import video from "./assets/random.mp4"

function Hero() {
  return (
    <>
      <div className='h-screen w-full bg-amber-500'>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0" 
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

        <div className='absolute text-center top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-1xl '>
          FitCraft enables users to design personalized wearables using built-in drawing tools, image uploads, or AI-generated graphics.
        </div>

        <h1 className='absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-5xl font-bold'>
          FitCraft
        </h1>

        <button className='rounded-full absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 py-5 px-10 bg-white text-black'>
          Create Now
        </button>
      </div>
    </>
  );
}

export default Hero;
