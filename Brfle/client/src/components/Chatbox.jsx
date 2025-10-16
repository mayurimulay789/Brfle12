import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Hello! I'm Brfle Assistant. How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const lower = userInput.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hi there! 😊 Welcome to Brfle. How can I assist you today?";
    } else if (lower.includes("course")) {
      return "🎓 We offer a variety of courses on Yoga, Meditation, and Personal Development. You can explore them on our Courses page.";
    } else if (lower.includes("register") || lower.includes("login")) {
      return "🔑 You can log in or register easily from the top navigation bar.";
    } else if (lower.includes("payment") || lower.includes("checkout")) {
      return "💳 You can complete payments securely on our Checkout page.";
    } else if (lower.includes("contact") || lower.includes("support")) {
      return "📞 You can contact our support team via email at support@brfle.com.";
    } else if (lower.includes("about")) {
      return "🌱 Brfle is your wellness companion — empowering learning, balance, and growth.";
    } else {
      return "🤖 I'm here to help with information about Brfle. Try asking about courses, login, payments, or support!";
    }
  };

  const quickReplies = [
    "Courses Offered 📚",
    "How to Register 📝",
    "Payment Help 💳",
    "Contact Support ☎️",
  ];

  const openWhatsApp = () => {
    const phoneNumber = "+919579484008"; // your WhatsApp number
    const message = "Hello! I need assistance with Brfle services.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-3 sm:space-y-4">
      {/* WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 sm:p-3 shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
        aria-label="Contact via WhatsApp"
      >
        {/* ✅ Official WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 32 32"
          className="w-6 h-6 sm:w-7 sm:h-7"
        >
          <path d="M16.002 2.917A13.04 13.04 0 0 0 3 15.958c0 2.314.608 4.573 1.77 6.566L3 29l6.633-1.737a13.09 13.09 0 0 0 6.369 1.63h.002A13.039 13.039 0 0 0 29 15.958 13.04 13.04 0 0 0 16.002 2.917zm0 23.801a10.74 10.74 0 0 1-5.467-1.496l-.393-.233-3.937 1.03 1.05-3.84-.256-.395a10.742 10.742 0 0 1-1.682-5.867c0-5.94 4.833-10.773 10.773-10.773 2.877 0 5.582 1.122 7.62 3.16a10.711 10.711 0 0 1 3.153 7.613c0 5.94-4.833 10.774-10.773 10.774zm6.17-8.056c-.338-.169-1.994-.983-2.302-1.096-.308-.113-.533-.169-.758.169s-.869 1.096-1.066 1.322c-.196.225-.393.253-.73.084-.338-.169-1.427-.526-2.718-1.678-1.006-.898-1.683-2.006-1.88-2.344-.196-.338-.021-.52.148-.689.151-.15.338-.394.507-.59.169-.197.225-.338.338-.563.112-.225.056-.422-.028-.59-.084-.169-.758-1.834-1.039-2.51-.272-.652-.549-.565-.758-.576-.197-.008-.422-.01-.648-.01s-.59.084-.898.422c-.308.338-1.176 1.148-1.176 2.799s1.205 3.244 1.374 3.47c.169.225 2.372 3.62 5.747 5.079.803.346 1.43.553 1.919.707.807.257 1.543.221 2.125.134.648-.097 1.994-.814 2.274-1.598.28-.783.28-1.453.196-1.598-.084-.141-.308-.225-.646-.394z" />
        </svg>
      </button>

      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-3 sm:p-3 shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          {/* Chat Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 8h10M7 12h6m-9 8v-6a9 9 0 0118 0v6l-3-3H6l-3 3z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-72 sm:w-80 h-[26rem] sm:h-[28rem] flex flex-col transition-all duration-300 ease-in-out backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold text-lg">Brfle Assistant</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-800 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="flex flex-wrap gap-2 px-3 py-2 bg-gray-900 border-t border-gray-700">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => setInput(reply)}
                className="text-xs bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-3 py-1 transition-all duration-300"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-900 border-t border-gray-700 rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 text-white rounded-full p-2 transition-transform duration-300 disabled:opacity-50"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;