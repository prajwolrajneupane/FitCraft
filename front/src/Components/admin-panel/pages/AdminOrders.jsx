import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const approveOrder = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/orders/${id}/approve`,
        {
          method: "PATCH",
        }
      );
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (orders.length === 0) return <div>No pending orders.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <p>
                <strong>Design Name:</strong> {order.designName}
              </p>
              <p>
                <strong>User ID:</strong> {order.userId}
              </p>
              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>
              <p>
                <strong>Size:</strong> {order.preferredSize}
              </p>
              <p>
                <strong>Address:</strong> {order.address}, {order.city},{" "}
                {order.state}, {order.zip}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <img
                src={order.modelUrl}
                alt={order.designName}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <button
                onClick={() => approveOrder(order._id)}
                className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;
