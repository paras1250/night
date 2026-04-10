import React from 'react';
import { motion } from 'framer-motion';

export const Fox = ({ position = 0, isJumping = false }) => (
  <motion.div
    initial={false}
    animate={{ 
      x: position,
      y: isJumping ? [-20, 0] : 0 
    }}
    transition={{ 
      x: { type: "spring", stiffness: 100, damping: 15 },
      y: { duration: 0.3, repeat: isJumping ? Infinity : 0, repeatType: "reverse" }
    }}
    className="text-5xl absolute z-20 drop-shadow-lg"
    style={{ bottom: '1rem', left: 0 }}
  >
    🦊
  </motion.div>
);

export const Rabbit = ({ isFound = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: isFound ? 1 : 0, 
      scale: isFound ? 1 : 0.5,
      y: isFound ? [0, -20, 0] : 0
    }}
    transition={{ duration: 0.5, y: { duration: 0.4, repeat: 2 } }}
    className="text-5xl absolute z-10 drop-shadow-lg"
    style={{ bottom: '1rem' }}
  >
    🐰
  </motion.div>
);

export const Bush = ({ value, isEliminated, isTarget, isFound, position }) => (
  <motion.div
    animate={{ 
      opacity: isEliminated ? 0.2 : 1,
      scale: isEliminated ? 0.8 : 1,
      filter: isEliminated ? "grayscale(100%)" : "none"
    }}
    className={`relative flex flex-col items-center justify-end w-16 h-28 ${isEliminated ? 'pointer-events-none' : ''}`}
  >
    {/* The value text */}
    <div className={`mb-2 font-mono font-bold text-lg 
      ${isTarget && isFound ? 'text-glow drop-shadow-[0_0_8px_rgba(126,217,87,1)]' : 'text-green-100'} 
      ${isEliminated ? 'text-gray-600' : ''}`}>
      {value}
    </div>
    
    {/* The bush graphic */}
    <div className="text-6xl drop-shadow-md">
      🌿
    </div>
    
    {/* The rabbit hiding behind if it's the target and found */}
    {isTarget && <Rabbit isFound={isFound} />}
  </motion.div>
);

export const Bird = ({ hint }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: hint ? 1 : 0, y: hint ? 0 : -20 }}
    className="absolute top-10 right-20 text-4xl flex items-center gap-4 z-30"
  >
    {hint && (
      <div className="bg-white text-black text-sm px-4 py-2 rounded-2xl rounded-tr-none font-bold shadow-lg relative max-w-[200px]">
        {hint}
        <div className="absolute right-[-8px] top-0 w-0 h-0 border-l-[8px] border-t-[8px] border-l-white border-t-transparent"></div>
      </div>
    )}
    🐦
  </motion.div>
);
