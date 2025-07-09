import React from "react";
import { Link } from 'react-router-dom';

const items = [
  { name: "T-Shirt", image: "/blackT.png", threeD:"/tshirt.glb" },
  { name: "Hoodie", image: "/hoodie.png" ,threeD:"/hoodie.glb"},
  { name: "Cap", image: "/cap.png",threeD:"/cap.glb" },
  { name: "Hat", image: "/cap.png" },
  { name: "Shirt", image: "/shirt.png",threeD:"/Shirt.glb" },
  { name: "Monkey Cap", image: "/monkeycap.png" },
];

export default function Wearables() {

  const handleSelect = (item) => {
    console.log(`Selected item: ${item.name}`);
  };

  return (
    <div className="h-screen w-full py-12 px-4 sm:px-6 lg:px-10 ">
      <div className="max-w-3xl mx-auto text-center ">
        <h1 className="text-3xl font-bold mb-10">Choose what to Design</h1>
        <div className="flex flex-wrap justify-center gap-15">
          {items.map((item) => (
            <Link to={`/Canvas/${item.name}`} state={item} key={item.name}>
              <div
                onClick={() => handleSelect(item)}
                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col items-center w-40"
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
