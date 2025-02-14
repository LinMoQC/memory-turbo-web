import React from 'react';

const Loading: React.FC = () => {
    return (
      <div className="w-full bg-transparent flex justify-center items-center z-50">
        <div className="w-full animate-pulse flex flex-col space-y-4">
          <div className="bg-gray-200 h-6 rounded-md w-full"></div>
          <div className="bg-gray-200 h-6 rounded-md w-full"></div>
          <div className="bg-gray-200 h-6 rounded-md w-full"></div>
          <div className="bg-gray-200 h-6 rounded-md w-full"></div>
        </div>
      </div>
    );
}

export default Loading