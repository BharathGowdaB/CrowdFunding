import React, { useState } from 'react';

const ToggleBar = ({ onToggle }) => {
  const [isStarter, setIsStarter] = useState(false);

  const handleToggle = () => {
    setIsStarter(!isStarter);
    onToggle(!isStarter);
  };

  return (
    <div className="flex items-center justify-end mt-4 mr-4">
      <div className="relative inline-flex items-center w-36 h-12 rounded-half bg-gray-400 cursor-pointer" onClick={handleToggle}>
        <div className={`absolute left-0 top-0 w-16 h-12 rounded-half transition-transform duration-1000 ease-in-out ${isStarter ? 'transform translate-x-20 bg-green-400' : 'transform translate-x-0 bg-white'}`}></div>
        <div className={`absolute inset-0 flex items-center justify-between px-2 text-sm font-semibold ${isStarter ? 'text-white' : 'text-gray-600'}`}>
          <span>Backer</span>
          <span>Starter</span>
        </div>
      </div>
    </div>
  );
};

export default ToggleBar;
