import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jpg';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Footer from './footer';

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit.configure({ bulletList: false }), Bold, Italic, Underline],
    content: '',
    editorProps: {
      handleDOMEvents: {
        focus: () => {
          setIsFocused(true);
          return false;
        },
        blur: () => {
          setIsFocused(false);
          return false;
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        <p className="text-lg font-medium">Loading user info...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plainText = editor?.getText().trim();
    const messageHTML = editor?.getHTML();

    if (!plainText) {
      setError('Message cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3001/api/contact', {
        email: user.email,
        name: user.name,
        message: messageHTML,
      });

      setSubmitted(true);
      setError('');
      editor?.commands.clearContent();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white text-gray-800 shadow-md">
        <img src={Logo} alt="BookBuddy Logo" className="w-14 h-14 object-cover rounded-full" />
        <div className="flex flex-wrap space-x-4 text-sm sm:text-base">
          <button onClick={() => navigate('/DashboardReader')} className="hover:text-indigo-600">Home</button>
          <button onClick={() => navigate('/terms')} className="hover:text-indigo-600">Upload</button>
          <button onClick={() => navigate('/chat')} className="hover:text-indigo-600">Chat</button>
          <button
            onClick={() => navigate('/contact')}
            className="text-indigo-700 font-semibold underline"
          >
            Contact Us
          </button>
          <button onClick={() => navigate('/profile')} className="hover:text-indigo-600">Profile</button>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={`http://localhost:3001/uploads/${user.profile_pic}`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">Contact Us</h1>
            <p className="text-center text-gray-600 mb-8">
              Welcome to <span className="font-semibold">BookBuddy</span> – your personal reading companion. Have a question, feedback, or issue? Let us know below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-semibold">Your Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Your Message</label>
                <div className="flex space-x-2 mb-2">
                  <button type="button" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 rounded border bg-gray-100 hover:bg-gray-200 text-sm font-medium">
                    <b>B</b>
                  </button>
                  <button type="button" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 rounded border bg-gray-100 hover:bg-gray-200 text-sm font-medium italic">
                    I
                  </button>
                  <button type="button" aria-label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 rounded border bg-gray-100 hover:bg-gray-200 text-sm font-medium underline">
                    U
                  </button>
                </div>

                <div
                  className={`w-full rounded-lg min-h-[150px] p-2 focus:outline-none ${
                    isFocused ? 'border-none ring-2 ring-indigo-300' : 'border border-gray-300'
                  }`}
                >
                  <EditorContent editor={editor} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Characters: {editor?.getText().length || 0}</p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Thank you for contacting us!</h2>
            <p className="text-gray-700 mb-6">We’ll get back to you shortly via email.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
            >
              Send Another Message
            </button>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: 'How do I update my profile information?',
              a: 'You can contact us if any changes are needed and we will do from our end within 2 business days.',
            },
            {
              q: 'Can I chat with any user on BookBuddy?',
              a: 'Yes, simply search for the user in the Chat section and start a conversation in real time.',
            },
            {
              q: 'How can I view all my uploaded books?',
              a: 'Go to the Uploads section in your dashboard to see and manage all your uploaded books.',
            },
            {
              q: 'Is my data secure on BookBuddy?',
              a: 'Yes, we use industry-standard encryption and best practices to ensure the safety and privacy of your data.',
            },
            {
              q: 'Is BookBuddy free to use?',
              a: 'Absolutely! BookBuddy is completely free for readers and authors alike.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="bg-white p-4 rounded shadow cursor-pointer">
              <summary className="font-medium">{q}</summary>
              <p className="mt-2 text-gray-600">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
