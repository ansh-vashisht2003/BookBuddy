import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.jpg";
import Footer from './footer';
const socket = io("http://localhost:3001");

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      socket.emit("add-user", user.email);
      axios.get("http://localhost:3001/api/chat/users").then((res) => {
        const filtered = res.data.filter((u) => u.email !== user.email);
        setUsers(filtered);
      });
    }
  }, [user]);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      if (
        selectedUser &&
        (data.sender === selectedUser.email || data.receiver === selectedUser.email)
      ) {
        setChat((prev) => [...prev, data]);
      }
    });
    return () => socket.off("receive-message");
  }, [selectedUser]);

  const fetchChatHistory = async (receiver) => {
    const res = await axios.get("http://localhost:3001/api/chat/history", {
      params: { sender: user.email, receiver },
    });
    setChat(res.data);
  };

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    fetchChatHistory(u.email);
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;
    const msg = {
      sender: user.email,
      receiver: selectedUser.email,
      content: message,
    };
    await axios.post("http://localhost:3001/api/chat/send", msg);
    socket.emit("send-message", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <img src={Logo} alt="BookBuddy Logo" className="w-14 h-14 object-cover rounded-full" />
        <div className="space-x-6 flex flex-wrap text-sm sm:text-base">
          <button onClick={() => navigate('/DashboardReader')} className="hover:text-indigo-600 transition">Home</button>
          <button onClick={() => navigate('/terms')} className="hover:text-indigo-600 transition">Upload</button>
          <button className="text-indigo-600 font-semibold underline">Chat</button>
          <button onClick={() => navigate('/contact')} className="hover:text-indigo-600 transition">Contact Us</button>
          <button onClick={() => navigate('/profile_reader')} className="hover:text-indigo-600 transition">Profile</button>
        </div>
        <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 cursor-pointer">
          <img src={`http://localhost:3001/uploads/${user.profile_pic}`} className="w-10 h-10 rounded-full border-2 border-indigo-500" />
          <span className="font-medium">{user.name}</span>
        </div>
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={`http://localhost:3001/uploads/${user.profile_pic}`} className="w-[300px] h-[300px] rounded-full border-4 border-white shadow-2xl object-cover" />
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-white bg-black/60 px-2 py-1 rounded-full hover:bg-black/80">✕</button>
          </div>
        </div>
      )}

      {/* Main Section */}
      <div className="flex h-[calc(100vh-90px)] mt-4 px-4">
        {/* Sidebar */}
        <div className="w-1/3 bg-white rounded-xl shadow-lg overflow-y-auto">
          <h2 className="text-lg font-bold p-4 bg-indigo-100 text-indigo-800 rounded-t-xl">All Users</h2>
          {users.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No users available to chat.</p>
          )}
          {users.map((u) => (
            <div
              key={u.email}
              onClick={() => handleSelectUser(u)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition hover:bg-indigo-50 ${
                selectedUser?.email === u.email ? "bg-indigo-100" : ""
              }`}
            >
              <img src={`http://localhost:3001/uploads/${u.profile_pic}`} className="w-10 h-10 rounded-full object-cover border border-indigo-200" />
              <div className="flex flex-col">
                <span className="font-medium">{u.name}</span>
                <span className="text-sm text-gray-500">{u.email}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col ml-4 rounded-xl shadow-lg bg-white">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-gray-50 rounded-t-xl">
            {selectedUser ? (
              <>
                <img src={`http://localhost:3001/uploads/${selectedUser.profile_pic}`} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </>
            ) : (
              <div className="text-center w-full text-purple-600 font-semibold">
                Select a user to start chatting
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white scroll-smooth">
            {selectedUser ? (
              chat.map((m, i) => (
                <div key={i} className={`flex ${m.sender === user.email ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-3 rounded-xl shadow max-w-xs text-sm transition-all duration-300 ${
                      m.sender === user.email
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No messages to display</p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {selectedUser && (
            <div className="p-4 border-t bg-gray-50 flex items-center gap-2 rounded-b-xl">
              <input
                type="text"
                placeholder="Type a message and press Enter..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow-md transition"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default Chat;
