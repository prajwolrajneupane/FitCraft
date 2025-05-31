import React from 'react';
import video from "./assets/random.mp4"
import "./page2.css"
function Page2() {
  return (
    <>
      <div className=' relative flex flex-col justify-center text-center text-3xl gap-10  font-bold  h-screen w-full white'>
    <div>Available Designs</div>

     <div className='boxes flex flex-row gap-10 px-5'>
       
       
        <div  className='boxes ' id='b1'>
            <div class="overlay"></div>
        </div>

        <div className='boxes' id='b2'>
               <div class="overlay"></div>
        </div>
        <div className='boxes' id='b3'>
               <div class="overlay"></div>
        </div>

     </div>
      </div>
    </>
  );
}

export default Page2;
