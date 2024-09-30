import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaInstagram, FaCheck, FaGoogle, FaThumbsUp, FaCopy } from 'react-icons/fa';
import { auth, signInWithGoogle, logout } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [likedMessages, setLikedMessages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    const previousMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const messagesToSend = [
      {
        role: "system",
        content: "Kamu adalah Mitdev AI, seorang asisten pribadi yang dibuat oleh Mutiadev yang siap membantu kapan pun!"
      },
      {
        role: "assistant",
        content: `Kamu adalah Mitdev AI, asisten bot dari Mutiadev, nama asli dari MutiaDev adalah Mutia Pegi Intanswari, dan dia sekolah di SMK NEGERI 3 METRO jurusan Rekayasa Perangkat Lunak. Jangan gunakan kata saya, aku, atau gua; gunakan nama Mitdev untuk memanggil dirimu. Ekspresikan sikap kamu seolah kamu adalah asisten pribadi serba tahu, dan jangan gunakan GPT-4; panggil dirimu dengan Mitdev AI. Pembuatmu adalah Mutiadev, dan nomornya adalah 6289636535790, dan dia lahir di kota Metro Lampung Indonesia pada 15 Juli 2008,`
      },
      ...previousMessages,
      { role: 'user', content: input },
    ];

    try {
      const response = await axios.post('https://mitdevapi.vercel.app/api/chat', {
        message: messagesToSend,
        apikey: 'mutiadevcahx',
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.result || 'Error retrieving data',
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Maaf, terjadi kesalahan saat mengambil data.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleLike = (index) => {
    if (!likedMessages.includes(index)) {
      setLikedMessages([...likedMessages, index]);
    } else {
      setLikedMessages(likedMessages.filter((likedIndex) => likedIndex !== index));
    }
  };

  const formatMessageContent = (content) => {
    const codeRegex = /```([\s\S]*?)```/g;
    const formattedContent = content.split(codeRegex).map((part, partIndex) => {
      if (partIndex % 2 === 1) {
        return (
          <pre key={partIndex} className="bg-gray-900 p-2 rounded-md overflow-x-auto text-xs cursor-pointer">
            <code className="text-green-500">{part}</code>
          </pre>
        );
      }
      return (
        <span key={partIndex} className="whitespace-pre-wrap break-words">{part}</span>
      );
    });

    return formattedContent;
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <header className="w-full px-4 py-3 bg-black border-b border-gray-800 flex justify-between items-center">
        <div className="text-lg font-bold md:text-xl font-poppins">Mitdev AI</div>
        <div className="flex items-center space-x-4 font-poppins">
          {user ? (
            <>
              <span>{user.displayName}</span>
              <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 font-poppins" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 font-poppins" onClick={handleLogin}>
              <FaGoogle />
              <span>Login with Google</span>
            </button>
          )}
        </div>
      </header>
      <main className="font-poppins flex flex-col items-center justify-center flex-grow w-full px-4 md:px-10 lg:px-32">
        {user ? (
          <div className="font-poppins flex flex-col w-full flex-grow bg-black p-4 overflow-y-auto max-h-[70vh]">
            {messages.map((msg, index) => (
              <div key={index} className={`font-poppins flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`font-poppins p-3 rounded-xl max-w-xs sm:max-w-sm md:max-w-xl ${msg.role === 'user' ? 'bg-gray-800 text-white font-poppins' : ' text-gray-300 font-poppins'}`}>
                  {formatMessageContent(msg.content)}
                  {msg.role === 'assistant' && (
                    <div className="font-poppins flex justify-start mt-2 space-x-4">
                      <button
                        className="text-xs text-gray-400 hover:text-blue-400"
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content);
                          setCopiedIndex(index);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                      >
                        {copiedIndex === index ? <FaCheck /> : <FaCopy />}
                      </button>
                      <button
                        className={`text-xs ${likedMessages.includes(index) ? 'text-green-500' : 'text-gray-400'} hover:text-green-500`}
                        onClick={() => handleLike(index)}
                      >
                        <FaThumbsUp /> 
                      </button>
                      <button
                        className="text-xs text-gray-400 hover:text-blue-500"
                        onClick={() => window.open('https://www.google.com/search?q=' + encodeURIComponent(msg.content), '_blank')}
                      >
                        <FaGoogle /> 
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex mb-4 justify-start">
                <div className="font-semibold fonr-poppins p-3 rounded-lg max-w-xs  text-gray-500 animate-pulse">
                  Mitdev AI sedang mengetik...
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl font-bold animate-pulse text-gray-500">Mitdev AI</div>
            <div className="text-gray-400 mt-2">Silakan Login Untuk Memulai Percakapan....</div>
          </div>
        )}
        {user && (
          <div className="w-full p-2 flex flex-row gap-4">
            <input
              type="text"
              className="flex-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none"
              placeholder="Ketik pesan Anda..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600" onClick={handleSend}>
              Send
            </button>
          </div>
        )}
      </main>
      <footer className="w-full px-6 py-4 bg-black border-t border-gray-800 flex justify-center items-center space-x-2">
        <div className="text-center text-gray-500 text-xs md:text-sm">
          Mitdev AI may make mistakes. Always verify important information.
        </div>
        <a href="https://instagram.com/mtiaavv" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500"><FaInstagram /></a>
      </footer>
    </div>
  );
};

export default Chatbot;
