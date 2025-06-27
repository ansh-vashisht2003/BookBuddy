// src/components/WelcomeAnimation.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jpg';
import '../index.css'; // Ensure Tailwind config is applied

const WelcomeAnimation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/DashboardReader');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-animate text-center px-6">
      <img src={Logo} alt="BookBuddy Logo" className="w-24 h-24 mb-6 rounded-full shadow-lg" />
      <svg
        className="w-16 h-16 mb-6 text-indigo-700 animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6l6 6-6 6M6 6l6 6-6 6"
        />
      </svg>
      <h1 className="text-5xl font-extrabold text-indigo-800 mb-4">Welcome to BookBuddy 📚</h1>
      <p className="text-lg text-gray-800">Your personalized book space is loading...</p>
    </div>
  );
};

export default WelcomeAnimation;
