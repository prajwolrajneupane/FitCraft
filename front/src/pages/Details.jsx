import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Details = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    preferredSize: '',
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment-options', { state: formData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 border border-purple-200">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">Customer Details</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
              required
            />
          </div>
          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="preferredSize"
              value={formData.preferredSize}
              onChange={handleChange}
              className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
              required
            >
              <option value="">Select Size</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
              <option value="XL">Extra Large</option>
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="px-4 py-3 border border-purple-300 rounded-lg shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
          >
            Submit Details & Choose Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Details;
