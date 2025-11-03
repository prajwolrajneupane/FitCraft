import React, { useEffect } from "react";
import Nav from "./Components/Nav";
import { useParams, Link } from "react-router-dom";
import User from "./pages/User";
import Hero from "./Components/Hero";
import Page2 from "./pages/Page2";
function App() {
  return (
    <div className="font-coda">
      <Nav />
      <Hero />
      <Page2 />
    </div>
  );
}

export default App;
