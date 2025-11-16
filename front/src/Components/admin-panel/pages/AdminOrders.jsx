import React, { useEffect, useState } from "react";

export default function AdminOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return <div>Loading orders...</div>;
  if (!orders.length) return <div>No pending orders.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pending Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p>
                <strong>Design:</strong> {order.designName}
              </p>
              <p>
                <strong>User:</strong> {order.userId}
              </p>
              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <img
                src={order.modelUrl}
                alt={order.designName}
                className="w-24 h-24 object-cover rounded-md border"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
