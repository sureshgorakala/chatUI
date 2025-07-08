import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const sampleTasks = [
    { id:1, title: 'Call Summarization', color: 'bg-purple-100', bar: 'bg-purple-500', text: 'text-purple-600' },
    { id:2, title: 'Chat With Document', color: 'bg-blue-100', bar: 'bg-blue-500', text: 'text-blue-600' },
    { id:3, title: 'Text Conversation', color: 'bg-green-100', bar: 'bg-green-500', text: 'text-green-600' },
    { id:4, title: 'n8n Workflow', color: 'bg-red-100', bar: 'bg-red-500', text: 'text-red-600' },
];

const TaskCardGrid = () => {
    const [tasks, setTasks] = useState(sampleTasks);
    const navigate = useNavigate();

    const gotochat = (id) => {
        navigate(`/chat/`);
    };


    const addCard = () => {
        const newTask = {
            title: 'New Task',
            progress: Math.floor(Math.random() * 100),
            due: '2 Days Left',
            color: 'bg-yellow-100',
            bar: 'bg-yellow-500',
            text: 'text-yellow-600'
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const handleCardClick = (task) => {
        if(task.id ===4){
            n8nWorkflowLink()
        }else {
            gotochat()
        }
        
    };

    const n8nWorkflowLink = () => {
        //window.location.href = 'http://44.223.11.40:5678/webhook/a889d2ae-2159-402f-b326-5f61e90f602e/chat';
        window.open('http://44.223.11.40:5678/webhook/a889d2ae-2159-402f-b326-5f61e90f602e/chat', '_blank', 'noopener,noreferrer');

    };


    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 shadow-lg flex items-center justify-center">
                <h1 className="text-2xl font-bold">
                    Trafodion
                </h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 m-5 ">
                {tasks.map((task, idx) => (
                    <div key={idx} className={`aspect-square bg-white rounded-xl p-24 shadow ${task.color}`}
                        onClick={() => handleCardClick(task)}
                    >
                        <h2 className="text-center text-lg font-semibold mt-2 ">{task.title}</h2>

                    </div>
                ))}

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

export default TaskCardGrid;
