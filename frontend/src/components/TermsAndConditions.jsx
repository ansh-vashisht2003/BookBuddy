import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './footer';
const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreed) {
      navigate('/upload');
    } else {
      alert('You must agree to the terms before proceeding.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 text-gray-800">
      {/* Content */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 mb-10">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">📘 BookBuddy</h1>

        <marquee className="text-red-600 font-semibold mb-4">
          Please read the terms carefully before uploading book reviews or photos
        </marquee>

        {/* Eligibility Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-2">Eligibility</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Minimum Age:</strong> You must be at least 13 years old to use BookBuddy.
            <br /><br />
            <strong>Account:</strong> Only registered users with complete profiles can review or post content.
            <br /><br />
            <strong>Photo Validity:</strong> You may upload only your profile picture and a photo of <strong>you holding the book</strong> you are reviewing — to confirm authenticity and ownership.
          </p>
        </section>

        {/* Terms Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-2">Terms and Conditions</h2>
          <ol className="list-decimal pl-6 text-gray-700 leading-relaxed space-y-2">
            <li>Do <strong>not upload PDFs or eBooks</strong> — BookBuddy is for reviewing, not distributing book content.</li>
            <li>Only <strong>your own original reviews</strong> are allowed. Plagiarism or copying others' content is prohibited.</li>
            <li>AI-generated or copied reviews will be flagged and removed. Repeat violations may result in suspension.</li>
            <li>Photos should be authentic — showing your face and the actual book you’re reviewing is required.</li>
            <li>All images are moderated. Fake or unrelated photos will be rejected.</li>
            <li>Reviews must be respectful, constructive, and free from hate speech or offensive language.</li>
            <li>BookBuddy reserves the right to remove or edit any content that violates community guidelines.</li>
            <li>Personal information shared in public reviews is discouraged and may be removed for your privacy.</li>
            <li>Users can rate and comment on reviews, but harassment or spamming will lead to account penalties.</li>
            <li>Do not impersonate others or create multiple fake accounts. One genuine profile per user is allowed.</li>
            <li>By using BookBuddy, you grant us permission to display your reviews and photos on our platform.</li>
            <li>Any feedback, issues, or misuse can be reported via the Contact Us page.</li>
          </ol>
        </section>

        {/* Checkbox and Buttons */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 mr-2"
              required
            />
            <label htmlFor="terms" className="text-gray-800">
              I have read and agree to BookBuddy's terms and conditions
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 w-full sm:w-auto"
            >
              Accept and Proceed to Upload Book Photo
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboardreader')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 w-full sm:w-auto"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
{/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
