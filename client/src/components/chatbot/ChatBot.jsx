import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { RobotOutlined, CloseOutlined, SendOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Card from "./sections/Card";
import "../../assets/customCSS/RippleEffect.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // useEffect cho storedMessages
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      eventQuery("welcomeToUsingChatBot");
    }
  }, []);

  // useEffect cho lưu messages và cuộn
  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const textQuery = async (text) => {
    const newMessage = {
      who: "user",
      content: { text: { text: text } },
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/dialogflow/textQuery`,
        { text }
      );
      let botMessages = {};
      if (response.data.fulfillmentMessages.length > 0) {
        botMessages = response.data.fulfillmentMessages.map((content) => ({
          who: "bot",
          content: content,
        }));
      } else {
        botMessages = [
          {
            who: "bot",
            content: { text: { text: [response.data.fulfillmentText] } },
          },
        ];
      }

      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (error) {
      const errorMessage = {
        who: "bot",
        content: { text: { text: "Error occurred, please try again." } },
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      console.log("Error from textQuery: ", error);
    }
  };

  const eventQuery = async (event) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/dialogflow/eventQuery`,
        { event }
      );
      const botMessages = response.data.fulfillmentMessages.map((content) => ({
        who: "bot",
        content: content,
      }));
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (error) {
      const errorMessage = {
        who: "bot",
        content: { text: { text: "Error occurred, please try again." } },
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      console.log("Error from eventQuery: ", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      textQuery(e.target.value.trim());
      setInputValue("");
    }
  };

  const handleSendClick = () => {
    if (inputValue.trim()) {
      textQuery(inputValue.trim());
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const renderCards = (cards) => {
    return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />);
  };

  const renderMessage = (message, index) => {
    if (message.content && message.content.text && message.content.text.text) {
      return (
        <div
          key={index}
          className={`flex ${
            message.who === "user" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`max-w-[80%] sm:max-w-md px-4 py-2 rounded-lg ${
              message.who === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {message.content.text.text}
          </div>
        </div>
      );
    } else if (
      message.content &&
      message.content.payload &&
      message.content.payload.fields.card
    ) {
      return (
        <div key={index} className="flex justify-start mb-4">
          <div className="max-w-[80%] sm:max-w-md px-4 py-2 rounded-lg bg-gray-200">
            {renderCards(message.content.payload.fields.card.listValue.values)}
          </div>
        </div>
      );
    }
    return null;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <motion.div
          id="chatbot"
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer z-50 transition-all duration-300"
        >
          <RobotOutlined className="text-2xl" />
        </motion.div>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed p-2 bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto sm:w-[400px] sm:max-w-md h-[70vh] sm:h-[464px] bg-white border border-blue-500 rounded-2xl shadow-lg flex flex-col z-50"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">
              Chatbot AI hỗ trợ tư vấn món ăn
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <CloseOutlined className="text-lg" />
            </motion.button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="relative">
              <input
                ref={inputRef}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm pr-12 sm:pr-14"
                placeholder="Gửi một tin nhắn..."
                onKeyDown={handleKeyPress}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSendClick}
                className="absolute right-3 top-2 text-blue-600"
              >
                <SendOutlined className="text-lg" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default ChatBot;
