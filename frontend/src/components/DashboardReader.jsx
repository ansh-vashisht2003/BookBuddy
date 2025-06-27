import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jpg';
import Banner from './Banner.jpg';
import Footer from './footer';
const DashboardReader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const genres = [
    { name: 'Fiction', bg: 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-500' },
    { name: 'Non-Fiction', bg: 'bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500' },
    { name: 'Science', bg: 'bg-gradient-to-br from-blue-300 via-indigo-400 to-violet-500' },
    { name: 'Romance', bg: 'bg-gradient-to-br from-pink-200 via-rose-400 to-red-400' },
    { name: 'Fantasy', bg: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-500' },
    { name: 'Horror', bg: 'bg-gradient-to-br from-gray-800 via-gray-700 to-black text-white' },
    { name: 'Biography', bg: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400' },
    { name: 'Others', bg: 'bg-gradient-to-br from-slate-400 via-slate-600 to-gray-700 text-white' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-100 to-fuchsia-100 text-gray-800 font-sans">
      {/* Navbar */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-md">
        <img src={Logo} alt="BookBuddy Logo" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full" />

        <div className="flex flex-wrap gap-2 sm:gap-4 md:space-x-6 font-medium text-sm sm:text-base">
          {[
            { label: 'Home', path: '/dashboardreader' },
            { label: 'Upload', path: '/terms' },
            { label: 'Chat', path: '/chat' },
            { label: 'Contact Us', path: '/contact' },
            { label: 'Profile', path: '/profile' },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="text-gray-700 hover:text-indigo-600 transition duration-200 hover:underline"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          className="flex items-center space-x-2 cursor-pointer mt-2 sm:mt-0"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-indigo-600 object-cover"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/uploads/${user.profile_pic}`}
              alt="Enlarged Profile"
              className="w-72 h-72 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-black bg-opacity-40 text-white p-1 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative w-full h-64 sm:h-72 mt-6 mx-auto rounded-xl shadow-lg overflow-hidden">
        <img src={Banner} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-2xl sm:text-4xl font-bold">📚 Discover, Read, Share</h1>
          <p className="mt-2 text-sm sm:text-lg">Your literary journey begins here</p>
        </div>
      </div>

      {/* Search Book Button */}
      <div className="flex justify-center mt-10 px-4 sm:px-6">
        <button
          onClick={() => navigate('/book')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg transition transform hover:scale-105 text-sm sm:text-base"
        >
          🔍 Search Book Here
        </button>
      </div>

      {/* Genre Grid */}
      <div className="mt-10 sm:mt-12 px-4 sm:px-6 pb-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6 text-center">
          🎨 Explore Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {genres.map((genre, idx) => (
            <div
              key={idx}
              className={`${genre.bg} h-28 sm:h-36 rounded-2xl shadow-xl flex items-center justify-center text-white text-sm sm:text-lg font-semibold hover:scale-105 transform transition cursor-pointer`}
              onClick={() => navigate(`/showbooks?genre=${encodeURIComponent(genre.name)}`)}
            >
              {genre.name}
            </div>
          ))}
        </div>
      </div>
{/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default DashboardReader;
