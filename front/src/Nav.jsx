import React, { useEffect, useState } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

function Nav() {
  const [scroll, setScroll] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 50) {
        setScroll(false);
      } else {
        setScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Example GSAP animation


  return (
    <>

{/* AnimatePresence is a component from Framer Motion that enables exit animations when components are removed from the React tree. */}
{/* tyo scroll back garda kheri pani animation hos vanera */}
      <AnimatePresence>
        {scroll && (
          <motion.div
            className="navbarr fixed bg-black text-white top-0 left-0 w-full shadow-md z-50 py-5"
            key="navbar"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='content flex justify-between px-20'>
              <div className='logo'>FitCraft</div>
              <div className='elements flex gap-6'>
                <div>
                  Cart
                </div>
                <div>
                  My account
                </div>
              </div>
            </div>
        
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Nav;
