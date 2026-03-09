import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from './Logo.jpg';
import { FaTrashAlt, FaStar } from 'react-icons/fa';
import Footer from './footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/books/user_email/${user.email}`);
        const data = await res.json();
        setBooks(data.reverse());
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };
    if (user?.email) fetchUserBooks();
  }, [user]);

  const confirmDeleteBook = (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3001/api/books/${bookToDelete}`, { method: 'DELETE' });
      setBooks(prev => prev.filter(b => b._id !== bookToDelete));
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  if (!user) return null;

  const profilePicUrl = `http://localhost:3001/uploads/${user.profile_pic}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 font-sans">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <img src={Logo} alt="Logo" className="w-14 h-14 rounded-full object-cover" />
        <div className="space-x-6 hidden md:flex text-gray-700 font-medium">
          <button onClick={() => navigate('/DashboardReader')} className="hover:text-indigo-600">Home</button>
          <button onClick={() => navigate('/terms')} className="hover:text-indigo-600">Upload</button>
          <button onClick={() => navigate('/chat')} className="hover:text-indigo-600">Chat</button>
          <button onClick={() => navigate('/contact')} className="hover:text-indigo-600">Contact</button>
          <button className="text-indigo-600 font-semibold">Profile</button>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
          <img src={profilePicUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </header>

      {/* Profile Info */}
      <section className="flex flex-col items-center mt-12 px-6">
        <img
          src={profilePicUrl}
          alt="User"
          onClick={() => setIsProfileModalOpen(true)}
          className="w-36 h-36 rounded-full border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition"
        />
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Profile</h2>
          <div className="text-gray-600 text-left space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
          >
            Logout
          </button>
        </div>
      </section>

      {/* Book Collection */}
      <section className="mt-16 px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📚 My Book Feed</h2>
        {books.length === 0 ? (
          <p className="text-center text-gray-600">You haven’t uploaded any books yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <img src={profilePicUrl} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                  </div>
                  <button onClick={() => confirmDeleteBook(book._id)} className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </div>

                <img
                  src={`http://localhost:3001/bookpic/${book.book_cover}`}
                  alt={book.title}
                  className="w-full h-60 object-cover cursor-pointer"
                  onClick={() => setEnlargedImage(`http://localhost:3001/bookpic/${book.book_cover}`)}
                />

                <div className="px-4 py-2 space-y-1">
                  <div className="flex space-x-1 py-2 text-yellow-500">
                    {Array.from({ length: book.rating }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-600">Genre: {book.genre}</p>
                  <p className="text-sm text-gray-600">Review: {book.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsProfileModalOpen(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={profilePicUrl} alt="Profile large" className="w-80 h-80 rounded-full object-cover border-4 border-white shadow-2xl" />
            <button className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full" onClick={() => setIsProfileModalOpen(false)}>✕</button>
          </div>
        </div>
      )}

      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setEnlargedImage(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={enlargedImage} alt="Book large" className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg" />
            <button className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full" onClick={() => setEnlargedImage(null)}>✕</button>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
            <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
            <h3 className="text-xl font-semibold mb-4">Delete Book</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this book?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
