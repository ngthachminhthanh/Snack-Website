import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { RobotOutlined, CloseOutlined } from '@ant-design/icons';
import Card from "./sections/Card";
import "../../assets/customCSS/RippleEffect.css";

function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedMessages = sessionStorage.getItem('chatMessages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        } else {
            eventQuery('welcomeToUsingChatBot');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const textQuery = async (text) => {
        const newMessage = {
            who: 'user',
            content: { text: { text: text } }
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        try {
            const response = await axios.post('http://localhost:5000/api/dialogflow/textQuery', { text });
            let botMessages = {};
            if (response.data.fulfillmentMessages.length > 0) {
                botMessages = response.data.fulfillmentMessages.map(content => ({
                    who: 'bot',
                    content: content
                }));
            } else {
                botMessages = [
                    {
                        who: 'bot',
                        content: { text: { text: [response.data.fulfillmentText] } }
                    }
                ];
            }

            setMessages(prevMessages => [...prevMessages, ...botMessages]);
        } catch (error) {
            const errorMessage = {
                who: 'bot',
                content: { text: { text: "Error occurred, please try again." } }
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            console.log('Error from textQuery: ', error);
        }
    };

    const eventQuery = async (event) => {
        try {
            const response = await axios.post('http://localhost:5000/api/dialogflow/eventQuery', { event });
            const botMessages = response.data.fulfillmentMessages.map(content => ({
                who: 'bot',
                content: content
            }));
            setMessages(prevMessages => [...prevMessages, ...botMessages]);
        } catch (error) {
            const errorMessage = {
                who: 'bot',
                content: { text: { text: "Error occurred, please try again." } }
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            console.log('Error from eventQuery: ', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            textQuery(e.target.value.trim());
            e.target.value = "";
        }
    };

    const renderCards = (cards) => {
        return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />);
    };

    const renderMessage = (message, index) => {
        if (message.content && message.content.text && message.content.text.text) {
            return (
                <div key={index} className={`flex ${message.who === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.who === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        {message.content.text.text}
                    </div>
                </div>
            );
        } else if (message.content && message.content.payload && message.content.payload.fields.card) {
            return (
                <div key={index} className="flex justify-start mb-4">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200">
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
            <div id="chatbot" onClick={toggleChat}>
                <RobotOutlined className="text-white text-2xl" />
            </div>
            {isOpen && (
                <div className="fixed bottom-5 left-36 w-[400px] h-[464px] bg-white border-2 border-blue-500 rounded-lg shadow-lg hover:shadow-xl flex flex-col z-50 transition-shadow duration-300">
                    <div className="flex justify-between items-center p-4 border-b border-slate-400">
                        <h3 className="font-bold">Trợ lý bán hàng hỗ trợ tư vấn sản phẩm</h3>
                        <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
                            <CloseOutlined />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((message, index) => renderMessage(message, index))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t">
                        <input
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Gửi một tin nhắn..."
                            onKeyDown={handleKeyPress}
                            type="text"
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBot;