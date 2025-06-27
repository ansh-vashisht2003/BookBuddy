import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Reader',
    profile_pic: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'profile_pic' ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await fetch('http://localhost:3001/api/users/signup', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error?.includes("already registered")) {
          setErrors({ email: "Email is already registered" });
        } else {
          setErrors({ server: result.error || "Signup failed" });
        }
      } else {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setErrors({ server: "🚨 Server error. Please try again later." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-white border-opacity-20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-500">Create your account in seconds</p>
        </div>

        {success && (
          <div className="text-green-600 text-sm text-center font-semibold mb-4">
            {success}
          </div>
        )}
        {errors.server && (
          <div className="text-red-500 text-sm text-center font-semibold mb-4">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300"
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300"
                placeholder="********"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300"
                placeholder="********"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300"
            >
              <option value="Reader">Reader</option>
              <option value="Author">Author</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700 font-medium">Profile Picture</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.profile_pic ? formData.profile_pic.name : "PNG, JPG, GIF (max 5MB)"}
                  </p>
                </div>
                <input
                  type="file"
                  name="profile_pic"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
          >
            Create Account
          </button>

          <p className="text-center text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Log in
            </button>
          </p>
        </form>
      </div>
  
    </div>
  );
};
export default Signup;
