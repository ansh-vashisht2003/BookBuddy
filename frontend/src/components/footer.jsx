import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-center py-5 mt-12 shadow-inner">
      <p className="text-sm text-gray-700">
        Made with <span className="text-red-500 text-md">❤️</span> for Book Lovers | © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">BookBuddy</span>
      </p>
    </footer>
  );
};

export default Footer;
