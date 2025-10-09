import { useState, useEffect, useRef } from 'react';

// Loading animation component (Updated color)
const LoadingDots = () => (
  <div className="flex space-x-1 my-2">
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
  </div>
);

const Chatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setIsLoading(true);
      setInputMessage('');
      
      try {
        // NOTE: Functionality kept as original
        const response = await fetch('http://localhost:5000/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage }),
        });

        const data = await response.json();
        
        if (data.success) {
          setMessages(prev => [...prev, { 
            text: data.response, 
            sender: 'bot' 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            text: "I apologize, but I'm having trouble processing your request. Please try again.", 
            sender: 'bot' 
          }]);
        }
      } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, { 
          text: "I apologize, but I'm having trouble connecting to the server. Please try again later.", 
          sender: 'bot' 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* ====================================================================
        Chat Toggle Button: Vibrant Teal color, no notification bubble
        ====================================================================
      */}
      <button
        onClick={toggleChat}
        className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-5 shadow-2xl shadow-teal-500/50 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-300/80 flex items-center justify-center"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {/* Removed the notification bubble here */}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-24 right-0 w-80 md:w-96 bg-white rounded-3xl shadow-2xl shadow-gray-500/40 flex flex-col transform transition-all duration-300 ease-in-out">
          {/* ====================================================================
            Header: Gradient for a more premium feel, rounded top
            ====================================================================
          */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-5 rounded-t-3xl flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-lime-400 rounded-full border-3 border-white shadow-md"></div>
            </div>
            <div>
              <h3 className="font-extrabold text-xl">BRFLE AI Support</h3>
              <p className="text-sm opacity-90 font-light">Available now to assist you</p>
            </div>
          </div>

          {/* ====================================================================
            Message Container: Light background, better scrollbar
            ====================================================================
          */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[400px] min-h-[150px] bg-white custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Bot Avatar */}
                {message.sender === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center mr-2 self-start flex-shrink-0 shadow-lg shadow-teal-200/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                {/* Message Bubble:
                  - More pill-shaped for a friendly look.
                  - Gradient/vibrant color for user, soft white for bot.
                */}
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm font-medium shadow-lg transition-all duration-100 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-xl rounded-bl-xl rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl rounded-bl-sm border border-gray-200'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-3 rounded-t-xl rounded-br-xl rounded-bl-sm bg-gray-100 shadow-md">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Custom style for scrollbar (requires adding to global CSS or styled-components, but left here as a placeholder for the intent) */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #99f6e4; /* cyan-200 */
              border-radius: 20px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
          `}</style>

          {/* ====================================================================
            Input Form: Clean, recessed input with a gradient button
            ====================================================================
          */}
          <form onSubmit={handleSubmit} className="p-4 bg-white rounded-b-3xl border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-3 bg-gray-50 text-gray-800 border-2 border-transparent rounded-full focus:outline-none focus:border-teal-400 shadow-inner transition-all duration-200 text-base"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-full flex-shrink-0 transition-all duration-200 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;