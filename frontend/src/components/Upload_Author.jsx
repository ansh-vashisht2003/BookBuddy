import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './Logo.jpg';
import Footer from './footer';
export default function UploadBookAuthor() {
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

  useEffect(() => {
    if (!user || user.role !== 'Author') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const genres = [
    'Fiction', 'Non-Fiction', 'Science', 'Romance',
    'Fantasy', 'Horror', 'Biography', 'Others'
  ];

  const fetchBookData = async () => {
    if (isbn.length !== 13) {
      setError('❌ ISBN must be exactly 13 digits.');
      return;
    }

    try {
      const res = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );
      const book = res.data[`ISBN:${isbn}`];
      if (book) {
        setBookData({
          title: book.title || '',
          author: book.authors?.[0]?.name || '',
          year: book.publish_date || '',
        });
        setError('');
      } else {
        setError('❌ Book not found using this ISBN.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Error fetching book data. Try again later.');
    }
  };

  const handleRating = (star) => setRating(star);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('❌ Only .jpg and .png files are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('❌ File size should not exceed 2MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setBookCover(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      setError('❌ User not found. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('title', bookData.title);
    formData.append('author', bookData.author || user.name);
    formData.append('year', bookData.year);
    formData.append('genre', genre);
    formData.append('comment', comment);
    formData.append('rating', rating);
    formData.append('book_cover', bookCover);
    formData.append('user_email', user.email);
    formData.append('user_name', user.name);

    try {
      await axios.post('http://localhost:3001/api/books/upload', formData);
      setMessage('✅ Book uploaded successfully!');
      setIsbn('');
      setBookData({ title: '', author: '', year: '' });
      setGenre('');
      setComment('');
      setRating(0);
      setBookCover(null);
      document.getElementById('book-cover-input').value = '';
    } catch (err) {
      console.error(err);
      setError('❌ Failed to upload book. Please try again.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200 text-gray-800">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-10">
        <img src={Logo} alt="BookBuddy Logo" className="w-14 h-14 object-cover rounded-full" />
        <div className="flex gap-6 text-sm sm:text-base font-medium">
          <button onClick={() => navigate('/dashboardauthor')} className="hover:text-indigo-600 transition">Home</button>
          <button onClick={() => navigate('/terms_author')} className="text-indigo-600 font-semibold">Upload</button>
          <button onClick={() => navigate('/profile_a')} className="hover:text-indigo-600 transition">Profile</button>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </div>

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

      {/* Upload Form */}
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-indigo-600">Upload Your Book</h2>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded text-center font-medium transition duration-300">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-center font-medium transition duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div className="flex gap-2">
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter 13-digit ISBN"
              className="w-full border border-indigo-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="button"
              onClick={fetchBookData}
              className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600"
            >
              Autofill
            </button>
          </div>

          <input
            type="text"
            value={bookData.title}
            readOnly
            placeholder="Title"
            className="w-full border p-2 rounded bg-gray-100"
          />
          <input
            type="text"
            value={bookData.author}
            readOnly
            placeholder="Author"
            className="w-full border p-2 rounded bg-gray-100"
          />
          <input
            type="text"
            value={bookData.year}
            readOnly
            placeholder="Year"
            className="w-full border p-2 rounded bg-gray-100"
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your comment..."
            required
            className="w-full border p-2 rounded"
          />

          <div className="flex items-center gap-2">
            <label className="font-medium">Rating:</label>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleRating(s)}
                className={`text-2xl ${rating >= s ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>

          <input
            id="book-cover-input"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
          >
            Upload Book
          </button>
        </form>
      </div>
{/* ✅ Footer */}
      <Footer />
    </div>
  );
};