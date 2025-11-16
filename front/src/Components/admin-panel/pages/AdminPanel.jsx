import React, { useState } from "react";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";
import AdminLogin from "./AdminLogin";

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [page, setPage] = useState("dashboard"); // dashboard, users, orders

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  if (!token) {
    return <AdminLogin onLogin={(t) => setToken(t)} />;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li
            className="mb-2 cursor-pointer hover:underline"
            onClick={() => setPage("dashboard")}>
            Dashboard
          </li>
          <li
            className="mb-2 cursor-pointer hover:underline"
            onClick={() => setPage("users")}>
            Users
          </li>
          <li
            className="mb-2 cursor-pointer hover:underline"
            onClick={() => setPage("orders")}>
            Orders
          </li>
          <li
            className="mt-4 cursor-pointer text-red-500 hover:underline"
            onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {page === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to the admin panel!</p>
          </div>
        )}
        {page === "users" && <AdminUsers token={token} />}
        {page === "orders" && <AdminOrders token={token} />}
      </div>
    </div>
  );
}
