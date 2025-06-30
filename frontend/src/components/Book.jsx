import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo.jpg';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import Footer from './footer';

const ShowBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.genre.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-gray-800">
      {/* Navbar */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-30">
        <img src={Logo} alt="BookBuddy Logo" className="w-14 h-14 object-cover rounded-full" />
        <div className="space-x-6 hidden md:flex">
          {['Home', 'Upload', 'Chat', 'Contact Us', 'Profile'].map((label, idx) => (
            <button
              key={idx}
              onClick={() =>
                navigate(
                  ['/dashboardreader', '/terms', '/chat', '/contact', '/profile'][idx]
                )
              }
              className="text-gray-700 hover:text-indigo-600 hover:underline font-medium transition"
            >
              {label}
            </button>
          ))}
        </div>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsProfileModalOpen(true)}
        >
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-600"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/uploads/${user.profile_pic}`}
              alt="Profile Large"
              className="w-80 h-80 rounded-full object-cover border-4 border-white shadow-2xl"
            />
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-60 px-3 py-1 rounded-full hover:bg-opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Book Cover Enlarged Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={enlargedImage}
              alt="Enlarged Book"
              className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain shadow-lg"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-60 px-3 py-1 rounded-full hover:bg-opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-grow flex flex-col px-6 pb-10">
        {/* Search */}
        <div className="w-full px-4 sm:px-8 mt-6">
          <input
            type="text"
            placeholder="Search by title, author or genre..."
            className="w-full px-5 py-3 text-sm md:text-base rounded-lg shadow focus:outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400 transition duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Book Grid or No Books Message */}
        <div className="mt-10 flex-grow flex flex-col">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">All Uploaded Books</h2>

          {filteredBooks.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-lg italic text-gray-500">No books found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 flex flex-col"
                >
                  {/* Uploader Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`http://localhost:3001/uploads/${book.profile_pic ?? 'default.jpg'}`}
                      alt="Uploader"
                      className="w-10 h-10 rounded-full object-cover border-2"
                    />
                    <span className="font-medium text-gray-700">{book.user_name}</span>
                  </div>

                  {/* Book Cover */}
                  <img
                    src={`http://localhost:3001/bookpic/${book.book_cover || 'default-book.jpg'}`}
                    alt={book.title}
                    onClick={() =>
                      setEnlargedImage(`http://localhost:3001/bookpic/${book.book_cover || 'default-book.jpg'}`)
                    }
                    className="w-full h-52 object-cover rounded-lg mb-3 shadow-sm cursor-pointer hover:opacity-90 transition"
                  />

                  {/* Rating */}
                  <div className="flex mb-2 text-yellow-500">
                    {Array.from({ length: book.rating || 0 }, (_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  {/* Info */}
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">By {book.author}</p>
                  <p className="text-sm text-gray-700 mb-1">Genre: {book.genre}</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Review:</span> {book.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShowBooks;
