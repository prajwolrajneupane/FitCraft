import React from "react";
import { Link, useNavigate } from "react-router-dom";

function ASidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-panel/login");
  };

  return (
    <div className="w-60 bg-gray-800 text-white h-screen p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <Link to="." className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="users" className="hover:text-gray-300">
              Users
            </Link>
          </li>
          <li>
            <Link to="orders" className="hover:text-gray-300">
              Orders
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300 mt-5 w-full text-left">
          Logout
        </button>
      </div>
    </div>
  );
}

export default ASidebar;
