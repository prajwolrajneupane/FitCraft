import React, { useEffect } from "react";
import Nav from "./Components/Nav";
import { useParams, Link } from "react-router-dom";
import User from "./pages/User";
import Hero from "./Components/Hero";
import Page2 from "./pages/Page2";
import HowItWorks from "./Components/HowItWorks";
import Footer from "./Footer.jsx";
function App() {
  return (
    <div className="font-coda ">
      <Nav />
      <Hero />
      <Page2 />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default App;
