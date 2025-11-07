import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful!");
      navigate("/login"); // Redirect to login after signup
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    // Updated: Darker background (like the footer in the image)
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      {/* Updated: Container with border/shadow, darker scheme */}
      <div className="bg-gray-800 shadow-xl rounded-lg w-full max-w-md p-8 border border-gray-700">
        {/* Updated: Heading to match the main accent color (teal/cyan) */}
        <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            // Updated: Dark input fields with lighter text/placeholder and teal focus ring
            className="w-full p-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            // Updated: Dark input fields with lighter text/placeholder and teal focus ring
            className="w-full p-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            // Updated: Dark input fields with lighter text/placeholder and teal focus ring
            className="w-full p-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <button
            type="submit"
            // Updated: Button with the primary accent color (teal/cyan)
            className="w-full bg-teal-500 hover:bg-teal-400 text-gray-900 font-bold py-3 rounded-md transition duration-200 shadow-lg">
            Sign Up
          </button>
        </form>

        {/* Updated: Text color and link color to match the dark theme and accent */}
        <p className="mt-8 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-400 hover:text-teal-300 font-medium transition duration-150">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
