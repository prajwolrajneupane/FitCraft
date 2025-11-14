import React from "react";
import Sidebar from "../Components/ASidebar.jsx";
import Navbar from "../Components/ANavbar.jsx";

function AdminDashBoard() {
  return (
    <div className="flex">
      <div className="flex-1">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">AdminDashBoard</h1>
          <p>Welcome to the admin panel!</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashBoard;
