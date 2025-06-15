import React, { useState, useRef, useEffect } from 'react';

// Main App component
const App = () => {
    // State to store chat messages. Each message is an object { type: 'user' | 'assistant', text: string, file: string | null }
    const [messages, setMessages] = useState([]);
    // State to store the current user input in the text field
    const [userInput, setUserInput] = useState('');
    // State to manage loading status while waiting for API response
    const [isLoading, setIsLoading] = useState(false);
    // Ref for the file input element to programmatically click it
    const fileInputRef = useRef(null);
    // Ref for the chat messages container to enable auto-scrolling
    const messagesEndRef = useRef(null);
    // State to manage sidebar visibility on smaller screens
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Dummy data for previous chats
    const [previousChats, setPreviousChats] = useState([
        "Chat about React components",
        "Discussion on AI models",
        "Project ideas brainstorm",
        "Frontend development tips",
        "Holiday planning"
    ]);

    // Effect to scroll to the bottom of the chat messages whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to scroll the chat messages container to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handler for sending a message (text or file)
    const handleSendMessage = async () => {
        if (userInput.trim() === '' && !fileInputRef.current?.files[0]) {
            return; // Don't send empty messages or if no file is selected
        }

        const newMessage = { type: 'user', text: userInput };
        let fileInfo = null;

        // If a file is selected, add its name to the message
        if (fileInputRef.current?.files[0]) {
            fileInfo = fileInputRef.current.files[0].name;
            newMessage.file = fileInfo; // Add file info to the user message
        }

        // Add the user's message to the chat history
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setUserInput(''); // Clear the text input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
        }

        // If it's just a file upload without text, only show the file message.
        // Otherwise, send the text to the LLM.
        if (userInput.trim() !== '') {
            setIsLoading(true); // Set loading state
            try {
                // Prepare chat history for the API call
                let chatHistory = messages.map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));
                chatHistory.push({ role: "user", parts: [{ text: userInput }] });

                const payload = { contents: chatHistory };
                const apiKey = ""; // API key is provided by the environment
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const assistantResponse = result.candidates[0].content.parts[0].text;
                    // Add the assistant's response to the chat history
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
                setIsLoading(false); // Clear loading state
            }
        }
    };

    // Handler for the file input change event
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Display a temporary message about the selected file
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'info', text: `File selected: ${file.name}` }
            ]);
            // Optionally, you could set a state here to indicate a file is ready to be sent
            // For this UI, we'll just show the message and clear the input after send.
        }
    };

    // Handler for clicking the upload button to trigger the hidden file input
    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Handler for starting a new chat
    const handleNewChat = () => {
        setMessages([]); // Clear all messages
        setUserInput(''); // Clear user input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input
        }
        // Optionally, add a new dummy chat to the previous chats list
        setPreviousChats(prev => [`New Chat ${prev.length + 1}`, ...prev]);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans antialiased overflow-hidden">
            {/* Sidebar Toggle Button for Small Screens */}
            <button
                className="lg:hidden absolute top-4 left-4 z-20 p-2 bg-blue-600 text-white rounded-full shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* Sidebar */}
            <aside
                className={`transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 transition-transform duration-300 ease-in-out
                w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg z-10 lg:relative absolute inset-y-0 left-0`}
            >
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-blue-400 mb-4 flex items-center">
                        <i className="fas fa-gem mr-2 text-blue-300"></i>Trafodian
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
                    <h3 className="text-lg font-semibold text-gray-400 mb-3">Previous Chats</h3>
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
            </aside>

            {/* Main Chat Content */}
            <div className="flex-1 flex flex-col">
                {/* Header for main content (only visible when sidebar is closed on small screens) */}
                <header className="lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 shadow-lg rounded-b-xl flex items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        <i className="fas fa-comments mr-2"></i>Conversational Assistant
                    </h1>
                </header>

                {/* Chat Messages Area */}
                <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            Start a conversation or upload a file!
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-xs sm:max-w-md md:max-w-lg shadow-md ${
                                    msg.type === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : msg.type === 'assistant'
                                        ? 'bg-gray-200 text-gray-800 rounded-bl-none'
                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300' // For info messages
                                }`}
                            >
                                {msg.text}
                                {msg.file && (
                                    <div className="text-sm mt-1 opacity-80">
                                        <i className="fas fa-paperclip mr-1"></i>
                                        <span className="font-semibold">{msg.file}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none shadow-md">
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Typing...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} /> {/* Element to scroll into view */}
                </main>

                {/* Input Area */}
                <div className="bg-white p-4 shadow-xl rounded-t-xl flex items-center space-x-3">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {/* Upload button */}
                    <button
                        onClick={handleUploadButtonClick}
                        className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out shadow-sm"
                        title="Upload File"
                    >
                        <i className="fas fa-paperclip text-xl"></i>
                    </button>

                    {/* Text input field */}
                    <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 shadow-sm"
                        placeholder="Type your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevent new line in input
                                handleSendMessage();
                            }
                        }}
                    />

                    {/* Send button */}
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

            {/* Tailwind CSS and Font Awesome CDN */}
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
