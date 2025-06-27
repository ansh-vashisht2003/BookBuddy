import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from './Logo.jpg';
import Footer from './footer';
const TermsAuthor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="BookBuddy Logo" className="w-10 h-10 rounded-full" />
          <span className="text-xl font-bold text-indigo-700 hidden sm:block">BookBuddy Author</span>
        </div>
        <div className="flex gap-6 text-sm sm:text-base font-medium">
          <button onClick={() => navigate('/dashboardauthor')} className="hover:text-indigo-600 transition">Home</button>
          <button onClick={() => navigate('/terms_author')} className="hover:text-indigo-600 transition">Upload</button>
          <button onClick={() => navigate('/profile_a')} className="hover:text-indigo-600 transition">Profile</button>
        </div>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-indigo-400 object-cover"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </nav>

      {/* Terms & Directions Section */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">Upload Terms & Directions</h1>
        <p className="text-lg text-gray-700 mb-6">
          Please follow the below guidelines to ensure your book is successfully uploaded and reaches your readers effectively.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-400 space-y-5">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><span className="font-semibold">Book Title:</span> Must be clear, concise, and avoid special characters.</li>
            <li><span className="font-semibold">Author Name:</span> Enter your real or pen name consistently.</li>
            <li><span className="font-semibold">Genre:</span> Choose the most appropriate category to help readers find your work.</li>
            <li><span className="font-semibold">Book Cover:</span> Upload a high-quality image (jpg, png only, max 2MB).</li>
            <li><span className="font-semibold">Book File:</span> Only PDFs are supported, max file size 10MB.</li>
            <li><span className="font-semibold">Content Authenticity:</span> Make sure your submission is original or properly credited.</li>
            <li><span className="font-semibold">Copyright:</span> Do not upload copyrighted material without permission.</li>
            <li><span className="font-semibold">Once uploaded:</span> You will see your submission under “Your Recent Uploads”.</li>
          </ul>

          <div className="text-sm text-gray-500 italic">
            Note: Violation of these terms may lead to removal of content or suspension of your account.
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/upload_a')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition font-medium"
          >
            I Agree, Proceed to Upload
          </button>
        </div>
      </section>
  {/* ✅ Footer */}
      <Footer />
    </div>
  );
};
export default TermsAuthor;
