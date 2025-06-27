import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Login failed');
        setMessageType('error');
      } else {
        localStorage.setItem('token', data.token);
        login(data.user);

        setMessage('Login successful! Redirecting...');
        setMessageType('success');

        setTimeout(() => {
          const role = data.user?.role;
          if (role === 'Author') {
            navigate('/profile_author');
          } else if (role === 'Reader') {
            navigate('/profile_reader');
          } else {
            setMessage('Unknown user role');
            setMessageType('error');
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again later.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-700 px-4 py-12">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-5">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Welcome Back</h2>

        {message && (
          <div
            className={`text-sm text-center px-4 py-2 rounded-xl ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold"
        >
          Log In
        </button>

        <p className="text-center text-gray-500">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-indigo-500 hover:underline font-medium"
            type="button"
          >
            Sign Up
          </button>
        </p>
      </form>
 
    </div>
  );
};
export default Login;
