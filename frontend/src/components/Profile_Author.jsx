import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from './Logo.jpg';
import { FaTrashAlt } from 'react-icons/fa';
import Footer from './footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userBooks, setUserBooks] = useState([]);
  const [mentionedBooks, setMentionedBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const userRes = await fetch(`http://localhost:3001/api/books/user_email/${user.email}`);
        const userData = await userRes.json();
        setUserBooks(userData.reverse());

        const authorRes = await fetch(`http://localhost:3001/api/books/author/${user.name}`);
        const authorData = await authorRes.json();

        const filtered = authorData.filter(book => {
          const bookAuthor = book.author?.replace(/\s+/g, '').toLowerCase() || '';
          const userName = user.name?.replace(/\s+/g, '').toLowerCase() || '';
          return bookAuthor === userName;
        });

        setMentionedBooks(filtered.reverse());
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };

    if (user?.email) fetchBooks();
  }, [user]);

  const handleDelete = async (bookId) => {
    try {
      await fetch(`http://localhost:3001/api/books/${bookId}`, {
        method: 'DELETE',
      });
      setUserBooks(prev => prev.filter(book => book._id !== bookId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  if (!user) return null;

  const profilePicUrl = `http://localhost:3001/uploads/${user.profile_pic}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <img src={Logo} alt="BookBuddy Logo" className="w-14 h-14 object-cover rounded-full" />
        <div className="space-x-6 hidden md:flex text-gray-700 font-medium">
          <button onClick={() => navigate('/dashboardauthor')} className="hover:text-indigo-600 transition">Home</button>
          <button onClick={() => navigate('/terms_author')} className="hover:text-indigo-600 transition">Upload</button>
          <button onClick={() => navigate('/profile_a')} className="hover:text-indigo-600 transition">Profile</button>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img src={profilePicUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mt-12 px-6">
        <img
          src={profilePicUrl}
          alt="User"
          onClick={() => setIsModalOpen(true)}
          className="w-36 h-36 rounded-full border-4 border-white shadow-lg transition-transform hover:scale-105 duration-300 cursor-pointer"
        />
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Profile</h2>
          <div className="text-gray-600 space-y-2 text-left">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
          <button
            onClick={logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile Picture Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative">
            <img
              src={profilePicUrl}
              alt="Enlarged Profile"
              className="w-[300px] h-[300px] rounded-full object-cover border-4 border-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-full hover:bg-opacity-60"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-600">Are you sure you want to delete this book?</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600" onClick={() => handleDelete(confirmDeleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Books */}
      <div className="mt-16 px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📚 Books You Uploaded</h2>
        {userBooks.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">You haven’t uploaded any books yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userBooks.map(book => (
              <BookCard
                key={book._id}
                book={book}
                user={user}
                profilePicUrl={profilePicUrl}
                onDelete={() => setConfirmDeleteId(book._id)}
              />
            ))}
          </div>
        )}

        {/* Mentioned Books */}
        <h2 className="text-3xl font-bold text-gray-800 mt-20 mb-6 text-center">📖 Books You Are Mentioned In</h2>
        {mentionedBooks.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No books found where you're listed as the author.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mentionedBooks.map(book => (
              <BookCard
                key={book._id}
                book={book}
                user={user}
                profilePicUrl={profilePicUrl}
                hideDelete
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const BookCard = ({ book, user, profilePicUrl, onDelete, hideDelete }) => {
  const [showPreview, setShowPreview] = useState(false);
  const coverUrl = `http://localhost:3001/bookpic/${book.book_cover}`;

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
          <div className="flex items-center space-x-2">
            <img src={profilePicUrl} alt="User" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-semibold text-gray-800">{user.name}</span>
          </div>
          {!hideDelete && (
            <button onClick={onDelete} title="Delete Book" className="text-red-500 hover:text-red-700">
              <FaTrashAlt />
            </button>
          )}
        </div>

        {/* ✅ Click to Preview Cover */}
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-60 object-cover cursor-pointer"
          onClick={() => setShowPreview(true)}
        />

        <div className="flex items-center px-4 py-2 space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill={i < book.rating ? '#facc15' : 'none'}
              viewBox="0 0 24 24"
              stroke="#facc15"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.716 5.29a1 1 0 00.95.69h5.545c.969 0 1.371 1.24.588 1.81l-4.49 3.26a1 1 0 00-.364 1.118l1.716 5.29c.3.922-.755 1.688-1.54 1.118l-4.49-3.26a1 1 0 00-1.176 0l-4.49 3.26c-.784.57-1.838-.196-1.539-1.118l1.715-5.29a1 1 0 00-.364-1.118l-4.49-3.26c-.783-.57-.38-1.81.588-1.81h5.545a1 1 0 00.95-.69l1.716-5.29z"
              />
            </svg>
          ))}
        </div>

        <div className="px-4 pb-4 space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
          <p className="text-sm text-gray-600">Author: {book.author}</p>
          <p className="text-sm text-gray-600">Genre: {book.genre}</p>
        </div>
      </div>

      {/* ✅ Book Cover Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={coverUrl} alt="Cover Preview" className="max-w-xs md:max-w-md rounded shadow-lg" />
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-sm hover:bg-opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
