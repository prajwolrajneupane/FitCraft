import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

function Store() {
  const { id } = useParams();
  const location = useLocation();
  const box = location.state;

  return (
    <div>
      <h1>Store Page</h1>
      <p>You've selected item with ID: {id}</p>

      {box ? (
        <div>
          <h2>{box.title}</h2>
          {box.price && <p>Price: {box.price}</p>}
          {box.rating && <p>Rating: {box.rating}</p>}
       {
        box.img &&
        
         <img src={box.img} alt=">>" />
       }
          <button className='rounded-full bg-purple-400 py-2 px-3 my-5' >Place Order</button>
        
        </div>
      ) : (
      <p>Unable to display </p>
      )}
    </div>
  );
}

export default Store;
