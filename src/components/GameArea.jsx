import React from 'react';

const GameArea = () => {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[400px]">
      {/* Dynamic Content will go here based on the level */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-jungle-dark/80 to-transparent pointer-events-none z-0"></div>
      
      {/* Just a placeholder graphic before actual implementation */}
      <div className="z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold font-mono text-green-300 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] mb-8">
          JUNGLE ARENA
        </h2>
        
        <div className="flex gap-4 items-end h-32 opacity-20">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-16 h-24 bg-green-800 rounded-t-full border-2 border-green-600"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameArea;
