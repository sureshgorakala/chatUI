import React, { useState } from 'react';

const sampleTasks = [
  { title: 'Web Designing', progress: 60, due: '2 Days Left', color: 'bg-orange-100', bar: 'bg-orange-500', text: 'text-orange-600' },
  { title: 'Web Designing', progress: 50, due: '2 Days Left', color: 'bg-blue-100', bar: 'bg-blue-500', text: 'text-blue-600' },
  { title: 'Web Designing', progress: 70, due: '2 Days Left', color: 'bg-green-100', bar: 'bg-green-500', text: 'text-green-600' },
  { title: 'Web Designing', progress: 70, due: '2 Days Left', color: 'bg-sky-100', bar: 'bg-sky-500', text: 'text-sky-600' },
  { title: 'Web Designing', progress: 70, due: '2 Days Left', color: 'bg-red-100', bar: 'bg-red-500', text: 'text-red-600' },
  { title: 'Web Designing', progress: 70, due: '2 Days Left', color: 'bg-purple-100', bar: 'bg-purple-500', text: 'text-purple-600' },
];

const TaskCardGrid = () => {
  const [tasks, setTasks] = useState(sampleTasks);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tasks.map((task, idx) => (
          <div key={idx} className={`rounded-xl p-4 shadow ${task.color}`}>
            <p className="text-sm text-gray-600">December 10, 2020</p>
            <h2 className="text-lg font-semibold mt-2">{task.title}</h2>
            <p className="text-sm text-gray-500 mb-4">Prototyping</p>

            {/* Progress Label */}
            <div className="text-sm font-medium text-gray-700 mb-1">Progress</div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full ${task.bar}`}
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
            <div className="text-right text-sm font-semibold text-gray-700 mb-4">
              {task.progress}%
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-sm mt-2">
              <div className="flex -space-x-2">
                {/* Sample avatars */}
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i + idx}`}
                    alt="avatar"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className={`font-semibold ${task.text}`}>{task.due}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={addCard}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg"
      >
      </button>
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
