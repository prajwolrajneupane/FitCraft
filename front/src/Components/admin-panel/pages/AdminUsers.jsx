import React, { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users");
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  if (!users.length) return <div>No users found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 border rounded-lg flex justify-between">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;
