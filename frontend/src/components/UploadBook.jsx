import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './Logo.jpg';
import Footer from './footer';
export default function UploadBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isbn, setIsbn] = useState('');
  const [bookData, setBookData] = useState({ title: '', author: '', year: '' });
  const [genre, setGenre] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [bookCover, setBookCover] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const genres = [
    'Fiction', 'Non-Fiction', 'Science', 'Romance',
    'Fantasy', 'Horror', 'Biography', 'Others'
  ];

  const fetchBookData = async () => {
    setError('');
    setMessage('');

    if (isbn.length !== 13 || !/^\d{13}$/.test(isbn)) {
      setError('❌ ISBN must be exactly 13 digits.');
      return;
    }

    try {
      const res = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const book = res.data[`ISBN:${isbn}`];
      if (book) {
        setBookData({
          title: book.title || '',
          author: book.authors?.[0]?.name || '',
          year: book.publish_date || '',
        });
        setMessage('✅ Book details autofilled!');
      } else {
        setError('❌ Book not found.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Error fetching book data.');
    }
  };

  const handleRating = (star) => setRating(star);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('❌ Only .jpg and .png files are allowed.');
      e.target.value = '';
      setBookCover(null);
      return;
    }

    setBookCover(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!user || !user.email) {
      setError('❌ User not found. Please login again.');
      return;
    }

    if (!bookCover) {
      setError('❌ Please upload a valid book cover.');
      return;
    }

    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('year', bookData.year);
    formData.append('genre', genre);
    formData.append('comment', comment);
    formData.append('rating', rating);
    formData.append('book_cover', bookCover);
    formData.append('user_email', user.email);
    formData.append('user_name', user.name);

    try {
      await axios.post('http://localhost:3001/api/books/upload', formData);
      setMessage('✅ Thank you for uploading your book!');
      setIsbn('');
      setBookData({ title: '', author: '', year: '' });
      setGenre('');
      setComment('');
      setRating(0);
      setBookCover(null);
      document.getElementById('book-cover-input').value = '';
    } catch (error) {
      console.error(error);
      setError('❌ Upload failed. Try again.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white text-gray-800 shadow-md">
        <img src={Logo} alt="BookBuddy Logo" className="w-12 h-12 object-cover rounded-full" />

        {/* Hamburger for small screens */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl">☰</button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 lg:space-x-6 text-sm sm:text-base">
          <button onClick={() => navigate('/DashboardReader')} className="hover:text-indigo-600">Home</button>
          <button onClick={() => navigate('/upload')} className="hover:text-indigo-600">Upload</button>
          <button onClick={() => navigate('/chat')} className="hover:text-indigo-600">Chat</button>
          <button onClick={() => navigate('/contact')} className="hover:text-indigo-600">Contact Us</button>
          <button onClick={() => navigate('/profile')} className="hover:text-indigo-600">Profile</button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-indigo-600"
          />
          <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white text-gray-800 shadow px-4 py-2 space-y-2">
          <button onClick={() => navigate('/DashboardReader')} className="hover:text-indigo-600">Home</button>
          <button onClick={() => navigate('/upload')} className="hover:text-indigo-600">Upload</button>
          <button onClick={() => navigate('/chat')} className="hover:text-indigo-600">Chat</button>
          <button onClick={() => navigate('/contact')} className="hover:text-indigo-600">Contact Us</button>
          <button onClick={() => navigate('/profile')} className="hover:text-indigo-600">Profile</button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative">
            <img
              src={`http://localhost:3001/uploads/${user.profile_pic}`}
              alt="Enlarged Profile"
              className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] rounded-full object-cover border-4 border-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-full hover:bg-opacity-60"
            >✕</button>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="max-w-xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-indigo-700">Upload a New Book</h2>

        {message && <div className="text-center mb-3 text-green-600 font-medium">{message}</div>}
        {error && <div className="text-center mb-3 text-red-500 font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" encType="multipart/form-data">
          <div>
            <label className="block font-semibold text-sm sm:text-base mb-1">ISBN (13-digit)</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN"
              className="w-full border rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={fetchBookData}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm"
            >
              Autofill Book Details
            </button>
          </div>

          {['title', 'author', 'year'].map((field) => (
            <div key={field}>
              <label className="block font-semibold text-sm sm:text-base mb-1 capitalize">{field}</label>
              <input
                type="text"
                value={bookData[field]}
                readOnly
                className="w-full bg-gray-100 border rounded-lg p-2 sm:p-3"
              />
            </div>
          ))}

          <div>
            <label className="block font-semibold text-sm sm:text-base mb-1">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              className="w-full border p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Select Genre --</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-sm sm:text-base mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              required
              className="w-full border p-2 sm:p-3 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <label className="font-semibold text-sm sm:text-base text-gray-700">Rating:</label>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleRating(s)}
                className={`text-xl sm:text-2xl ${rating >= s ? 'text-yellow-400' : 'text-gray-300'} transition`}
              >
                ★
              </button>
            ))}
          </div>

          <div>
            <label className="block font-semibold text-sm sm:text-base mb-1">Book Cover</label>
            <input
              type="file"
              id="book-cover-input"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="w-full text-sm border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium"
            >
              Upload Book
            </button>
          </div>
        </form>
      </div>
{/* ✅ Footer */}
      <Footer />
    </div>
  );
};