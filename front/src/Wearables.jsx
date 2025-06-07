import React from "react";
import { useParams, useLocation,Link } from 'react-router-dom';


const items = [
  { name: "T-Shirt", image: "/blackT.png" ,roll:10},
  { name: "Hoodie", image: "/hoodie.png" },
  { name: "Cap", image: "/cap.png" },
  { name: "Hat", image: "/cap.png" },
  { name: "Shirt", image: "/shirt.png" },
];

export default function Wearables() {
    
  const handleSelect = (item) => {
    console.log(`Selected item: ${item.name}`);
    
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Choose What to Design</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {items.map((item) => (
                 <Link to={`/Canvas/${item.name}`} state={item}>

<div
              key={item.name}
              onClick={() => handleSelect(item)}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-1 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-30 object-contain mb-4"
              />
              <span className="text-lg font-medium">{item.name}</span>
            </div>
</Link>

          ))}
        </div>
      </div>
    </div>
  );
}
