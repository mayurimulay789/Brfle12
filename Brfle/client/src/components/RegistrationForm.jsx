import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FullName: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [message, setMessage] = useState('');

  const { FullName, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!FullName.trim()) {
      setMessage('FullName is required');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData
      );
      setMessage('Registration successful!');
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="max-w-4xl w-full min-h-[500px] bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Optional left side image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/two.jpg')" }}
        >
          <div className="h-full w-full flex flex-col items-center justify-center bg-black bg-opacity-40">
            <h2 className="text-white text-3xl font-bold px-4 text-center">
              Join Us
            </h2>
            <p className="text-white text-sm mt-2 px-4 text-center">
              Register using your information to get started
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 p-8 -translate-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          <p className="text-center text-gray-500 mb-6">
            Fill in your information to create an account
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-700 mb-1">FullName</label>
              <input
                type="text"
                name="FullName"
                value={FullName}
                onChange={onChange}
                placeholder="Enter your FullName"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={role}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-between items-center text-sm">
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded font-semibold transition duration-300"
              >
                Register
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-amber-500 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
