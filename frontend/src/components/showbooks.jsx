import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo.jpg';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import Footer from './footer';

const ShowBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBookCover, setSelectedBookCover] = useState('');
  const [search, setSearch] = useState('');

  const genre = new URLSearchParams(location.search).get('genre');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchBooks();
    }
  }, [user, genre]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/books?genre=${genre || ''}`);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-gray-800">
      
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="BookBuddy Logo" className="w-12 h-12 rounded-full object-cover" />
          <span className="text-xl font-bold text-indigo-600 hidden sm:block">BookBuddy</span>
        </div>
        <nav className="space-x-4 hidden md:flex">
          {['/dashboardreader', '/terms', '/chat', '/contact', '/profile'].map((path, i) => (
            <button
              key={i}
              onClick={() => navigate(path)}
              className="text-gray-700 hover:text-indigo-600 font-medium transition hover:underline underline-offset-4"
            >
              {['Home', 'Upload', 'Chat', 'Contact Us', 'Profile'][i]}
            </button>
          ))}
        </nav>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsProfileModalOpen(true)}
        >
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
          />
          <span className="text-sm font-semibold text-indigo-700">{user.name}</span>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setIsProfileModalOpen(false)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/uploads/${user.profile_pic}`}
              alt="Profile Large"
              className="w-72 h-72 rounded-full object-cover border-4 border-white shadow-xl"
            />
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full hover:bg-opacity-70"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Book Cover Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsBookModalOpen(false)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/bookpic/${selectedBookCover}`}
              alt="Book Cover Large"
              className="w-[90vw] max-w-md h-auto rounded-lg shadow-xl border-4 border-white"
            />
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full hover:bg-opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-6 mt-8">
        <input
          type="text"
          placeholder="Search by title, author or genre..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring-2 focus:ring-indigo-300 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Books List */}
      <div className="px-6 mt-10 pb-20">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          {genre ? `Genre: ${genre} Books` : 'All Books'}
        </h2>

        {filteredBooks.length === 0 ? (
          <p className="text-gray-600 italic text-center pb-20 sm:pb-28 md:pb-36 lg:pb-44 xl:pb-52">
            No books found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition duration-300 border border-gray-100">
                
                {/* Uploader Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`http://localhost:3001/uploads/${book.profile_pic ?? 'default.jpg'}`}
                    alt="Uploader"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="font-semibold text-gray-800">{book.user_name}</span>
                </div>

                {/* Book Cover */}
                <img
                  src={`http://localhost:3001/bookpic/${book.book_cover || 'default-book.jpg'}`}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    setSelectedBookCover(book.book_cover || 'default-book.jpg');
                    setIsBookModalOpen(true);
                  }}
                />

                {/* Ratings */}
                <div className="flex mb-2 text-yellow-500">
                  {Array.from({ length: book.rating || 0 }, (_, i) => (
                    <FaStar key={i} className="mr-1" />
                  ))}
                </div>

                {/* Book Info */}
                <h3 className="text-lg font-semibold text-indigo-800">{book.title}</h3>
                <p className="text-sm text-gray-700 mb-1">By {book.author}</p>
                <p className="text-sm text-gray-700 mb-1">Genre: {book.genre}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Review:</span> {book.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ShowBooks;
