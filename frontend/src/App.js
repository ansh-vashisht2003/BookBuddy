import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import ProfileAuthor from './components/ProfileAuthor';
import Profile from './components/Profile';
import WelcomeAnimation from './components/WelcomeAnimation';
import DashboardReader from './components/DashboardReader';
import Contact from './components/Contact';
import UploadBook from './components/UploadBook';
import Chat from './components/Chat';
import SearchHere from './components/SearchHere'; // ✅ Fixed import
import './index.css';
import { AuthProvider } from './context/AuthContext';
import TermsAndConditions from './components/TermsAndConditions';
import Book from './components/Book'; // Import Book component
import ShowBooks from './components/showbooks';
import DashboardAuthor from './components/DashboardAuthor';
import TermsAuthor from './components/Terms_author';
import ProfileA from './components/Profile_Author'; // Import ProfileAuthor component
import UploadBookAuthor from './components/Upload_Author';
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile_author" element={<ProfileAuthor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile_reader" element={<WelcomeAnimation />} />
        <Route path="/DashboardReader" element={<DashboardReader />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/upload" element={<UploadBook />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/searchhere" element={<SearchHere />} /> {/* ✅ Updated path */}
        <Route path="/terms" element={<TermsAndConditions />} />
         <Route path="/Book" element={<Book />} />
         <Route path="/showbooks" element={<ShowBooks />} /> {/* ✅ Updated path */}
        <Route path="/dashboardauthor" element={<DashboardAuthor />} />
        <Route path="/terms_author" element={<TermsAuthor />} /> {/* ✅ Updated path */}
        <Route path="/profile_a" element={<ProfileA />} /> {/* ✅ Updated path */}
        <Route path="/upload_a" element={<UploadBookAuthor />} /> {/* ✅ Updated path */}
        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <div className="text-center text-red-500 text-xl mt-10">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
