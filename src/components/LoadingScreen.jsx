import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = "Venturing deeper into the jungle..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-jungle-dark flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="relative w-32 h-32 mb-8">
        {/* Animated animal silhouette or icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl"
        >
          🌴
        </motion.div>
        
        {/* Orbiting particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-500 rounded-full"
            animate={{
              rotate: 360,
              x: [20, 40, 20],
              y: [20, 40, 20],
              opacity: [0, 1, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + i,
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-glow text-xl font-bold tracking-widest uppercase mb-6"
      >
        {message}
      </motion.p>

      {/* Loading Bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-green-900/40 relative">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="mt-4 text-[10px] text-gray-600 uppercase tracking-tighter opacity-50">
        AlgoJungle Platform v1.0 • Panchatantra Edition
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
