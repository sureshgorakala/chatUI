import React from 'react';

const HoverCard = ({ title, progress, color = 'bg-purple-200', barColor = 'bg-purple-600' }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl shadow-md ${color} h-56 p-4`}>
      {/* Top Content */}
      <div>
        <p className="text-sm text-gray-600">December 10, 2020</p>
        <h2 className="text-lg font-semibold mt-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">Prototyping</p>
        <div className="text-sm font-medium text-gray-700 mb-1">Progress</div>
        <div className="w-full bg-gray-300 rounded-full h-2.5 mb-2">
          <div className={`h-2.5 rounded-full ${barColor}`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-right text-sm font-semibold text-gray-700">{progress}%</div>
      </div>

      {/* Hidden Bottom Panel (revealed on hover) */}
      <div
        className="absolute bottom-0 left-0 w-full px-4 py-3 bg-white text-sm text-gray-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-b-xl"
      >
        <p>Details: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/40?img=${i}`}
                alt="avatar"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="text-red-500 font-semibold">2 Days Left</span>
        </div>
      </div>
    </div>
  );
};

export default HoverCard;
