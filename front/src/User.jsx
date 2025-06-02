import React from 'react';

function UserPanel() {
  const username = "Prajwol";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-80 text-center">
        <h2 className="text-2xl font-bold mb-4">My account</h2>
        <p className="text-lg">Welcome, <span className="text-amber-500 font-semibold">{username}</span>!</p>
      </div>
    </div>
  );
}

export default UserPanel;
