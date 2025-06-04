import React, { useState } from 'react';
import './page2.css';
import { Link } from 'react-router-dom';
import kp from "./chillguy.png"
function Page2() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const boxes = [
    { id: 'b1', title: 'Kp Chill Guy', price:"200", rating:"4/5",img:kp },
    { id: 'b2', title: 'kp fataha' },
    { id: 'b3', title: 'raja aau desh bachau' },
  ];

  return (
    <div className='relative flex flex-col justify-center text-center gap-10 h-screen w-full white'>
      <div className='text-3xl'> Available Designs</div>

      <div className='boxes relative flex flex-row gap-10 px-5'>
        {boxes.map((box, index) => (
          <div
            key={box.id}
            className='boxes'
            id={box.id}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className='overlay'>
              {hoveredIndex===index && (
                <div className='z-1000 text-white flex flex-col gap-50'>
                  <div className='text text-2xl font-bold'>{box.title}</div>
                  <div className='Options flex flex-col gap-5 items-center'>
                    <button className='text-xs sm:text-sm md:text-base lg:text-2xl bg-amber-500 rounded-full py-2 w-[50%] px-2'>

                  <Link to={`/store/${box.id} ` } state={box} >

                      Buy Now
                      
</Link>
                    </button>
                    <button className='text-xs sm:text-sm md:text-base lg:text-2xl bg-blue-500 rounded-full py-2 w-[50%] px-2'>
                      Modify
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page2;
