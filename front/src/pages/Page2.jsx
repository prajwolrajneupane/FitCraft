import React, { useState } from 'react';
import './page2.css';
import { Link } from 'react-router-dom';
import blackT from "../assets/blackT.png"
function Page2() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const items = [
    { id: 'b1',image:"/blackT.png", name: 'Legit Tshirt', price:"200", rating:"4/5",img:blackT , threeD:"/tshirt.glb" },
    { id: 'b2', image:"/blackT.png",name: 'skibidi',price:"200", rating:"4/5" , threeD:"/tshirt.glb" },
    { id: 'b3', image:"/chillguy.png",name: 'KpChillGuy',price:"200", rating:"4/5" , threeD:"/tshirt.glb" },
  ];

  return (
    <div className='relative flex flex-col align-center  justify-center text-center gap-16 h-screen w-full  white'>
      <div className='text-3xl'> Available Designs</div>

      <div className='boxes relative flex flex-row gap-10 px-5 align-center justify-center w-full'>
        {items.map((box, index) => (
          <div
            key={box.id}
            className='boxes'
            id={box.id}
             style={{
            backgroundImage: `url(${box.image})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',}}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className='overlay'>
              {hoveredIndex===index && (
                <div className='z-1000 text-white flex flex-col gap-50'>
                  <div className='text text-2xl font-bold'>{box.name}</div>
                  <div className='Options flex flex-col gap-5 items-center'>
                    <button className='text-xs sm:text-sm md:text-base lg:text-2xl bg-amber-500 rounded-full py-2 w-[50%] px-2'>

                  <Link to={`/store/${box.id} ` } state={box} >

                      Buy Now
                      
</Link>
                    </button>
       
                    <button className='text-xs sm:text-sm md:text-base lg:text-2xl bg-blue-500 rounded-full py-2 w-[50%] px-2'>
       <Link to={`/Canvas/${box.name}`} state={box}>
                      Modify
       </Link>
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
