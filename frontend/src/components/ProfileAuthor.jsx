import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jpg';

const ProfileAuthor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const timer = setTimeout(() => {
        navigate('/dashboardauthor');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-100 to-pink-50 text-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in-up max-w-lg w-full">
        <img src={Logo} alt="BookBuddy Logo" className="w-20 h-20 rounded-full mb-4" />
        <h1 className="text-4xl font-bold text-indigo-700 mb-2 transition-all duration-500">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 text-lg">Redirecting to your author dashboard...</p>
        <div className="mt-6 w-full bg-indigo-100 rounded-full h-2 overflow-hidden">
          <div className="bg-indigo-600 h-2 animate-load-bar"></div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
          }

          @keyframes loadBar {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          .animate-load-bar {
            animation: loadBar 3s linear forwards;
          }
        `}
      </style>
    </div>
  );
};

export default ProfileAuthor;
