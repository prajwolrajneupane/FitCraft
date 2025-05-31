import React, { useState } from 'react';
import video from "./assets/random.mp4";
import "./page2.css";

function Page2() {
  const [hovered, sethovered] = useState(false);

  const setRef = (node) => {
    if (node) {
      node.addEventListener("mouseenter", () => {
        sethovered(true);
        
      });
        node.addEventListener("mouseleave", () => {
        sethovered(false);
        
      });

    }
    
  };

  return (
    <div className='relative flex flex-col justify-center text-center  gap-10  h-screen w-full white'>
      <div className='text-3xl'> Available Designs</div>

      <div className='boxes flex flex-row gap-10 px-5' >
        <div className='boxes' id='b1'ref={setRef} >
          <div className="overlay">
            {hovered && <div className='z-1000  text-white flex flex-col gap-50'>
                
                <div className='text text-2xl font-bold'>Kp Chill Guy</div>
                <div className='Options flex flex-col gap-5 items-center '>
<button className='text-2xl  bg-amber-500  rounded-full py-2 w-[50%] px-2' >Buy Now</button>
<button className='text-2xl bg-blue-500 rounded-full py-2 w-[50%] px-2'>Modify</button>
                </div>
                </div>}
          </div>
        </div>

        <div className='boxes' id='b2'>
          <div className="overlay"></div>
        </div>

        <div className='boxes' id='b3'>
          <div className="overlay"></div>
        </div>
      </div>
    </div>
  );
}

export default Page2;
