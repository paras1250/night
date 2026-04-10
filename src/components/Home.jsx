import React from 'react';
import { Play, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

const Home = ({ onSelectLevel }) => {
  const { playClick, isMuted, toggleMute } = useAudio();
  const levels = [
    { id: 'binary-search', title: 'Binary Search', desc: 'Find the hiding rabbit 🐰 using divide & conquer.', icon: '🦊' },
    { id: 'stack', title: 'Stack Operations', desc: 'Stack the plates 🍽️ with Push/Pop operations.', icon: '🥞' },
    { id: 'linked-list', title: 'Linked List', desc: 'Connect the nodes 🔗 across the river.', icon: '🐢' },
    { id: 'binary-tree', title: 'Binary Tree', desc: 'Navigate branches 🌳 to reach the top.', icon: '🐒' },
  ];

  const handleSelect = (id) => {
    playClick();
    onSelectLevel(id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-jungle-dark text-white jungle-gradient">
      {/* Dynamic Forest Backdrop */}
      <div className="absolute inset-0 z-0 scale-110">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter blur-sm grayscale-[0.5]" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-dark via-transparent to-jungle-dark" />
      </div>

      {/* Floating Audio Toggle */}
      <button 
        onClick={toggleMute}
        className="absolute top-8 right-8 z-50 p-3 bg-green-900/40 border border-green-500/30 rounded-full hover:bg-green-800/60 transition-all text-green-400"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-20 text-center mb-16"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-6xl">🐒</motion.span>
          <h1 className="text-8xl font-black italic tracking-tighter text-glow drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            ALGO<span className="text-jungle-sun">JUNGLE</span>
          </h1>
          <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="text-6xl">🦜</motion.span>
        </div>
        <p className="text-xl text-green-300 font-medium tracking-wide uppercase opacity-80 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-green-800" />
          Master the Data Wilderness
          <span className="h-px w-12 bg-green-800" />
        </p>
      </motion.div>

      <div className="z-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {levels.map((level, i) => (
          <motion.div 
            key={level.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(level.id)}
            className="p-8 rounded-[2rem] border-2 bg-green-900/40 border-green-500/50 hover:border-jungle-sun hover:bg-green-800/60 cursor-pointer backdrop-blur-md transition-all group relative overflow-hidden flex flex-col gap-4 shadow-2xl"
          >
            {/* Organic Texture Overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] " />
            
            <div className="flex justify-between items-start z-10">
              <span className="text-6xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">{level.icon}</span>
              <span className="bg-jungle-sun/20 text-jungle-sun text-[10px] px-4 py-1.5 rounded-full border border-jungle-sun/40 uppercase tracking-widest font-black shadow-glow-sm">
                Explore 🌿
              </span>
            </div>
            
            <div className="z-10 mt-2">
              <h2 className="text-3xl font-black text-white mb-2 group-hover:text-jungle-sun transition-colors leading-none tracking-tight">
                {level.title}
              </h2>
              <p className="text-green-100/70 text-sm font-medium leading-relaxed">
                {level.desc}
              </p>
            </div>

            <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-all rotate-12 group-hover:rotate-0 group-hover:scale-125">
               <Play size={100} strokeWidth={3} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
