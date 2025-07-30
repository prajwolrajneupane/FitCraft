import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });

  // This will be /User if redirected from Nav
  const from = location.state?.from

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      alert('Login successful!');
      localStorage.setItem('token', res.data.token);
      navigate(from); // navigate to the original page
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 border border-purple-200">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            className="w-full p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          No account?{' '}
          <Link
            to="/signup"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
