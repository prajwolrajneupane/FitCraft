import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import User from "./pages/User.jsx";
import Store from "./pages/Purchase.jsx";
import Canvas from "./canvas/Canvas.jsx";
import Notfound from "./pages/Notfound.jsx";
import Wearables from "./Components/Wearables.jsx";
import Checkout from "./pages/Checkout";
import EsewaSuccess from "./pages/EsewaSuccess";
import EsewaFailure from "./pages/EsewaFailure";
import PaymentOptions from "./pages/PaymentOptions.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import Login from "./Login/Login.jsx";
import SignUp from "./Login/SignUp.jsx";
import Details from "./pages/Details.jsx";

// 🧩 Admin imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ASidebar from "./Components/admin-panel/Components/ASidebar.jsx";
import AdminDashboard from "./Components/admin-panel/pages/AdminDashboard.jsx";

import AdminOrders from "./Components/admin-panel/pages/AdminOrders.jsx";
import AdminLogin from "./Components/admin-panel/pages/AdminLogin.jsx";
import AdminUsers from "./Components/admin-panel/pages/AdminUsers.jsx";

import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex">
      <ASidebar />
      <div className="flex-1 p-6">
        {/* Nested admin routes render here */}
        <Outlet />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/User", element: <User /> },
  { path: "/Store/:id", element: <Store /> },
  { path: "/Canvas/:name", element: <Canvas /> },
  { path: "/Canvas", element: <Canvas /> },
  { path: "/Wearables", element: <Wearables /> },
  { path: "/login", element: <Login /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "/details", element: <Details /> },
  { path: "/payment-options", element: <PaymentOptions /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/buy-now", element: <ProductDetailPage /> },
  { path: "/*", element: <Notfound /> },

  // 🧠 Nested Admin Panel Routes
  {
    path: "/admin-panel",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> }, // /admin-panel
      { path: "users", element: <AdminUsers /> }, // /admin-panel/users
      { path: "orders", element: <AdminOrders /> }, // /admin-panel/orders
    ],
  },

  // Separate route for admin login
  {
    path: "/admin-panel/login",
    element: <AdminLogin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
