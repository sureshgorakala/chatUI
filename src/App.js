import React, { useState, useRef, useEffect } from 'react';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const [previousChats, setPreviousChats] = useState([
        "Previous chat here"
    ]);

    const toggleMenu = () => setIsOpen(prev => !prev);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const createHttpRequest = async (url) => {
        let chatHistory = messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        chatHistory.push({ role: "user", parts: [{ text: userInput }] });
        const payload = { "query": userInput };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (userInput.trim() === '' && !fileInputRef.current?.files[0]) {
            return;
        }

        const newMessage = { type: 'user', text: userInput };
        let fileInfo = null;

        if (fileInputRef.current?.files[0]) {
            fileInfo = fileInputRef.current.files[0].name;
            newMessage.file = fileInfo;
        }

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setUserInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (userInput.trim() !== '') {
            setIsLoading(true);
            try {

                console.log("newMessage", newMessage)

                const url = `http://44.223.11.40:8000/api/query`
                const result = await createHttpRequest(url)

                if (result.answer && result.answer.length > 0) {
                    const assistantResponse = result.answer;
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { type: 'assistant', text: assistantResponse }
                    ]);
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { type: 'assistant', text: "Sorry, I couldn't get a response." }
                    ]);
                    console.error("Unexpected API response structure:", result);
                }
            } catch (error) {
                console.error("Error calling Gemini API:", error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'assistant', text: "There was an error communicating with the assistant." }
                ]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleFileChange = (event) => {
        setIsLoading(true);
        const file = event.target.files[0];

        if (!file) return;
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'info', text: `File selected: ${file.name}` }
        ]);

        const formData = new FormData();
        formData.append('file', file);

        console.log("====>", file)

        const allowedAudioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];


        const fileName = file.name;
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        let url = null
        let isAudio = false;
        if (allowedAudioExtensions.includes(extension)) {
            isAudio = true;
            url = 'http://44.223.11.40:8001/upload-call'
        } else {
            url = 'http://44.223.11.40:8000/api/upload'
        }


        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        type: 'file_data', text: JSON.stringify(data), genere: isAudio
                    }
                ]);
                setIsLoading(false);
            })
            .catch((err) => console.error('Error:', err));
    };
    const handleUploadButtonClick = () => {
        //setIsOpen(prev => !prev);
        fileInputRef.current?.click();
    };

    const handleNewChat = () => {
        setMessages([]);
        setUserInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        //setPreviousChats(prev => [`New Chat ${prev.length + 1}`, ...prev]);
    };
    return (
        <div className="flex h-screen bg-gray-100 font-sans antialiased overflow-hidden">
            <div className={` w-64 bg-gray-900 text-white p-4 shadow-lg z-10`}>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-blue-400 mb-4 flex items-center">
                        <i className="fas fa-gem mr-2 text-blue-300"></i>Trafodion
                    </h2>
                    <button
                        onClick={handleNewChat}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <i className="fas fa-plus-circle"></i>
                        <span>New Chat</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Previous Chats [Coming Soon!!] </h3>
                    <ul>
                        {previousChats.map((chat, index) => (
                            <li key={index} className="mb-2">
                                <a
                                    href="#"
                                    className="block p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out flex items-center space-x-2"
                                >
                                    <i className="fas fa-history text-gray-500"></i>
                                    <span>{chat}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="flex-1 flex flex-col">
                <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 shadow-lg flex items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        Conversational Assistant
                    </h1>
                </header>

                <main className="flex-1  p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            Start a conversation or upload a file!
                        </div>
                    )}
                    {messages.map((msg, index) => {

                        let displayed_filedata = null;
                        if (msg.type === "file_data") {
                            displayed_filedata = JSON.parse(msg.text)
                        }


                        return (
                            <div
                                key={index}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`rounded-lg max-w-xs sm:max-w-md md:max-w-lg shadow-md ${msg.type === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : msg.type === 'assistant'
                                            ? 'bg-gray-200 text-gray-800 rounded-bl-none'
                                            : 'bg-yellow-100 text-yellow-800 border' // For info messages
                                        }`}
                                >
                                    {msg.type != "file_data" && (
                                        <div style={{
                                            padding: "5px", background: '#E2ECF6',
                                            color: '#000000', width: (!msg.text.includes("File selected") && msg.type != 'user') ? '100rem' : 'auto'
                                        }}>
                                            {msg.text}
                                        </div>
                                    )}

                                    {(displayed_filedata != null && msg.genere) &&
                                        <div>
                                            <table style={{
                                                borderCollapse: 'collapse',
                                                border: '1px solid black',
                                                padding: '10px',
                                                background: '#E2ECF6',
                                                color: '#000000',
                                                width: '100rem'
                                            }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ border: '1px solid black', padding: '10px' }}>Section</th>
                                                        <th style={{ border: '1px solid black', padding: '10px' }}>Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', padding: '10px' }}>Transcript</td>
                                                        <td style={{ border: '1px solid black', padding: '10px' }}>{displayed_filedata['transcript']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', padding: '10px' }}>Entities</td>
                                                        <td style={{ border: '1px solid black', padding: '10px' }}>{displayed_filedata['entities']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid black', padding: '10px' }}>Summary</td>
                                                        <td style={{ border: '1px solid black', padding: '10px' }}>{displayed_filedata['summary']}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }


                                </div>
                            </div>
                        )
                    }
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none shadow-md">
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Please Wait...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <div className="bg-white p-4 shadow-xl rounded-t-xl flex items-center space-x-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={handleUploadButtonClick}
                        className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
                        title="Upload File"
                        style={{ position: 'relative', display: 'inline-block' }}
                        ref={menuRef}
                    >
                        <i className="fas fa-paperclip text-xl"></i>
                    </button>

                    <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 shadow-sm"
                        placeholder="Type your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />

                    <button
                        onClick={handleSendMessage}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || (userInput.trim() === '' && !fileInputRef.current?.files[0])}
                        title="Send Message"
                    >
                        <i className="fas fa-paper-plane text-xl"></i>
                    </button>
                </div>
            </div>

            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif; 
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                `}
            </style>
        </div>
    );
};

export default App;
