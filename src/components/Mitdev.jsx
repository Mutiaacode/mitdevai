import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaInstagram, FaCheck } from 'react-icons/fa';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false); // New state for fade out
  const [showChatbot, setShowChatbot] = useState(false); // New state for chatbot visibility
  const [fadeIn, setFadeIn] = useState(false); // New state for fade in
  const messageEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Start fade out
      const fadeOutTimer = setTimeout(() => {
        setShowWelcome(false); // Hide welcome message
        setShowChatbot(true); // Show chatbot UI
        setFadeIn(true); // Start fade in animation
      }, 1000); // Match this duration with your fade out animation time
      return () => clearTimeout(fadeOutTimer);
    }, 3000); // 3 seconds to show the welcome message

    return () => clearTimeout(timer);
  }, []);

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

  const [copiedIndex, setCopiedIndex] = useState(null);

  const formatMessageContent = (content, index) => {
    const codeRegex = /```([\s\S]*?)```/g;
    const formattedContent = content.split(codeRegex).map((part, partIndex) => {
      if (partIndex % 2 === 1) {
        return (
          <div key={partIndex} className="relative mb-2">
            <pre className="bg-gray-900 p-2 rounded-md overflow-x-auto text-xs cursor-pointer">
              <code className="text-green-500">{part}</code>
            </pre>
            <button
              className="absolute top-1 right-1 bg-gray-700 text-white text-xs rounded px-2 hover:bg-gray-600"
              onClick={() => {
                navigator.clipboard.writeText(part);
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
              }}
            >
              {copiedIndex === index ? <FaCheck /> : 'Salin'}
            </button>
          </div>
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
      {showWelcome ? (
        <div className={`text-2xl font-bold ${fadeOut ? 'fade-out' : 'fade-in'} text-center font-poppins`}>
          Mitdev AI 
        </div>
        
      ) : (
        <>
          <header className="w-full px-4 py-3 bg-black border-b border-gray-800 flex justify-between items-center">
            <div className="text-lg font-bold md:text-xl font-poppins">Mitdev AI</div>
            <div className="text-sm md:text-base font-poppins">Status: Active</div>
          </header>
          <main className={`flex flex-col items-center justify-center flex-grow w-full px-4 md:px-10 lg:px-32 ${fadeIn ? 'fade-in' : 'hidden'}`}>
            <div className="flex flex-col w-full flex-grow bg-black p-4 overflow-y-auto max-h-[70vh]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-xl ${
                      msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {formatMessageContent(msg.content, index)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex mb-4 justify-start">
                  <div className="p-3 rounded-lg max-w-xs bg-gray-700 text-gray-300 animate-pulse">
                    Mitdev AI sedang mengetik...
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
            <div className="w-full p-2 flex flex-row gap-2">
              <input
                type="text"
                className="flex-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none"
                placeholder="Ketik pesan Anda..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </main>
          <footer className="w-full px-6 py-4 bg-black border-t border-gray-800 flex justify-center items-center space-x-2">
            <div className="text-center text-gray-500 text-xs md:text-sm">
              Mitdev AI may make mistakes. Always verify important information.
            </div>
            <a href="https://instagram.com/mtiaavv" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">
              <FaInstagram className="w-5 h-5" />
            </a>
          </footer>
        </>
      )}
    </div>
  );
};

export default Chatbot;
