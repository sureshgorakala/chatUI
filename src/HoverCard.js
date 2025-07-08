import React from 'react';
import './App.css'; // make sure tailwind is imported here

const HoverCard = ({ task })  => {
  console.log(task)
  return (
    <div className="w-auto h-52 relative overflow-hidden rounded-xl shadow-lg group cursor-pointer">
      {/* Background image or content */}
      {/*<img
        src="https://www.crmbuyer.com/wp-content/uploads/sites/4/2024/04/customer-service-agent-smiling.jpg"
        alt="Nature"
        className="w-full h-full object-cover"
      />*/}

      <h2 className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
  {task.title}
</h2>


      {/* Overlay - hidden initially, slides up on hover */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black bg-opacity-50 text-white p-20
                      flex flex-col justify-end transform translate-y-full group-hover:translate-y-10
                      transition-transform duration-500 ease-in-out">
        <h2 className="text-lg font-semibold">{task.summary1}</h2>
        <p className="text-sm">{task.summary2}</p>
      </div>
    </div>
  );
};

export default HoverCard;