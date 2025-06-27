import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Logo from './Logo.jpg';
import axios from 'axios';
import dayjs from 'dayjs';
import Footer from './footer';

const DashboardAuthor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchUploads = useCallback(async () => {
    if (!user || !user.email) return;
    setLoading(true);
    setFetchError('');
    try {
      const res = await axios.get(`http://localhost:3001/api/books?user_email=${user.email}`);
      const filteredUploads = res.data.filter(book => book.user_email === user.email);
      setUploads(filteredUploads);
    } catch (error) {
      setFetchError('Unable to load your uploads. Please try again later.');
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUploads();
    }
  }, [user, navigate, fetchUploads]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-violet-50 to-purple-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="BookBuddy Logo" className="w-10 h-10 rounded-full" />
          <span className="text-xl font-bold text-violet-700 hidden sm:block">BookBuddy Author</span>
        </div>
        <div className="flex gap-6 text-sm sm:text-base font-medium">
          <button onClick={() => navigate('/dashboardauthor')} className="hover:text-violet-600 transition">Home</button>
          <button onClick={() => navigate('/terms_author')} className="hover:text-violet-600 transition">Upload</button>
          <button onClick={() => navigate('/profile_a')} className="hover:text-violet-600 transition">Profile</button>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/profile_a')}
        >
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-violet-400 object-cover"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </nav>

      {/* Content */}
      <section className="px-6 py-12">
        <h2 className="text-3xl font-bold text-violet-800 mb-2">
          Welcome back, <span className="text-rose-500">{user.name}</span>!
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          Let's inspire the world with your knowledge 📚
        </p>

        {/* Quote */}
        <div className="bg-white rounded-xl shadow p-4 mb-10 border-l-4 border-violet-400">
          <blockquote className="italic text-violet-600">
            “The only way to do great work is to love what you do.” – Steve Jobs
          </blockquote>
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-violet-100">
            <h3 className="text-xl font-semibold text-violet-700 mb-2">Upload New Book</h3>
            <p className="text-sm text-gray-600 mb-4">
              Showcase your knowledge or writing by uploading book reviews, summaries or PDFs.
            </p>
            <button
              onClick={() => navigate('/terms_author')}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
            >
              Upload Now
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-violet-100">
            <h3 className="text-xl font-semibold text-violet-700 mb-2">Edit Your Profile</h3>
            <p className="text-sm text-gray-600 mb-4">
              Keep your author profile updated so readers can recognize your work.
            </p>
            <button
              onClick={() => navigate('/profile_a')}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Go to Profile
            </button>
          </div>
        </div>

        {/* Uploads Section */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-violet-100">
          <h3 className="text-xl font-semibold text-violet-700 mb-4">Your Recent Uploads</h3>

          {loading ? (
            <p className="text-gray-500 italic">Loading your uploads...</p>
          ) : fetchError ? (
            <p className="text-red-500 font-medium">{fetchError}</p>
          ) : uploads.length === 0 ? (
            <p className="text-gray-500 italic">You haven't uploaded anything yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.slice(0, 6).map((book) => (
                <div
                  key={book._id}
                  className="border border-violet-200 rounded-xl p-4 bg-violet-50 hover:shadow-lg transition"
                >
                  <img
                    src={`http://localhost:3001/bookpic/${book.book_cover}`}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md mb-3 cursor-pointer"
                    onClick={() =>
                      setSelectedImage(`http://localhost:3001/bookpic/${book.book_cover}`)
                    }
                  />
                  <h4 className="text-lg font-semibold text-violet-800">{book.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
                  <p className="text-sm text-gray-600 mb-1">Genre: {book.genre}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    Uploaded on {dayjs(book.uploaded_at).format('DD MMM YYYY')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Book Cover"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardAuthor;
