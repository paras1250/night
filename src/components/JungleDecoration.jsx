import React from 'react';
import { motion } from 'framer-motion';

const JungleDecoration = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Top Left Vine */}
      <div className="absolute top-0 left-0 w-64 h-64 -translate-x-10 -translate-y-10 opacity-60">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-rustle">
          <path d="M10 0C10 50 40 80 80 90C120 100 150 140 160 200" stroke="#14532d" strokeWidth="8" strokeLinecap="round"/>
          <path d="M10 0C10 50 40 80 80 90C120 100 150 140 160 200" stroke="#166534" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10"/>
          {/* Leaves */}
          <ellipse cx="40" cy="40" rx="15" ry="8" fill="#15803d" transform="rotate(-30 40 40)"/>
          <ellipse cx="90" cy="80" rx="20" ry="10" fill="#16a34a" transform="rotate(20 90 80)"/>
          <ellipse cx="140" cy="130" rx="25" ry="12" fill="#22c55e" transform="rotate(-15 140 130)"/>
        </svg>
      </div>

      {/* Top Right Vine */}
      <div className="absolute top-0 right-0 w-96 h-96 translate-x-32 -translate-y-20 opacity-40">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-rustle" style={{ animationDelay: '1s' }}>
          <path d="M190 0C190 80 140 120 80 140C20 160 -10 180 -10 200" stroke="#14532d" strokeWidth="12" strokeLinecap="round"/>
          <ellipse cx="150" cy="60" rx="30" ry="15" fill="#15803d" transform="rotate(45 150 60)"/>
          <ellipse cx="80" cy="130" rx="35" ry="18" fill="#166534" transform="rotate(-10 80 130)"/>
        </svg>
      </div>

      {/* Dappled Sunlight Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.05)_0%,transparent_60%)]" />

      {/* Floating Leaves */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: `${Math.random() * 100}vw`, y: -20 }}
          animate={{
            y: '110vh',
            x: `${(Math.random() * 100) - 20}vw`,
            rotate: 360
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          className="absolute text-2xl opacity-20"
        >
          {['🍃', '🌿', '🌱'][Math.floor(Math.random() * 3)]}
        </motion.div>
      ))}
    </div>
  );
};

export default JungleDecoration;
