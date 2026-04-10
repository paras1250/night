import React from 'react';
import { motion } from 'framer-motion';

const SuccessConfetti = () => {
  const pieces = Array.from({ length: 40 });
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: "-10%", 
            left: `${Math.random() * 100}%`,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            top: "110%",
            rotate: 360 * 2,
            left: `${(Math.random() * 100) + (Math.random() * 20 - 10)}%`
          }}
          transition={{ 
            duration: Math.random() * 2 + 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
          className={`absolute w-3 h-3 rounded-sm ${['bg-green-400', 'bg-yellow-400', 'bg-blue-400', 'bg-pink-400', 'bg-emerald-400'][Math.floor(Math.random() * 5)]}`}
        />
      ))}
    </div>
  );
};

export default SuccessConfetti;
