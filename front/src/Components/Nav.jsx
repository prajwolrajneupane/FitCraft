import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';

function Nav() {
  const [scroll, setScroll] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAccountClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/User');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    // the from will tell the login to goto user after logged in
    navigate('/login',{ state: { from: '/User' }});
  };

  return (
    <>
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
              <div className='logo'>
                <Link to="/">FitCraft</Link>
              </div>
              <div className='elements flex gap-6'>
                <div>Cart</div>
                <div
                  onClick={handleAccountClick}
                  className="cursor-pointer hover:text-purple-300 transition"
                >
                  My Account
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Login Prompt Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-purple-700 mb-3">You're not logged in yet</h2>
              <p className="text-gray-600 mb-6">Please login to access your account.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Nav;
