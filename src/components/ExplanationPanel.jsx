import React from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExplanationPanel = ({ text = "The forest owl is thinking..." }) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-jungle-deep/80 backdrop-blur-md border-2 border-jungle-leaf/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group flex-1 flex flex-col min-h-[160px]"
    >
      {/* Wood Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] mix-blend-overlay" />
      
      {/* Corner Leaves */}
      <div className="absolute -top-2 -left-2 text-xl opacity-40 group-hover:opacity-80 transition-opacity">🍃</div>
      <div className="absolute -bottom-2 -right-2 text-xl opacity-40 group-hover:opacity-80 transition-opacity">🌿</div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="bg-jungle-leaf p-2 rounded-xl text-jungle-sun shadow-lg">
          <Info size={18} strokeWidth={2.5} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-jungle-vibrant/80">
          Explanation
        </h3>
      </div>
      
      <div className="flex-1 bg-black/40 rounded-xl p-5 border border-jungle-leaf/30 flex flex-col justify-center relative z-10 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-start gap-4"
          >
            <span className="text-5xl drop-shadow-xl animate-rustle">🦉</span>
            <p className="text-green-50 text-lg font-medium leading-relaxed pt-1">
              {text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExplanationPanel;
