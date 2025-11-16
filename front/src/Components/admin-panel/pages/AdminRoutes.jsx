import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";
import AdminLogin from "./AdminLogin";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-panel/login" />;
};

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <PrivateAdminRoute>
            <AdminDashboard />
          </PrivateAdminRoute>
        }
      />
      <Route
        path="users"
        element={
          <PrivateAdminRoute>
            <AdminUsers />
          </PrivateAdminRoute>
        }
      />
      <Route
        path="orders"
        element={
          <PrivateAdminRoute>
            <AdminOrders />
          </PrivateAdminRoute>
        }
      />
    </Routes>
  );
}
