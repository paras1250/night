import React from 'react';
import { ArrowLeft, Settings, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const Header = ({ levelName, onBack, score = 0 }) => {
  const { isMuted, toggleMute, playClick } = useAudio();

  const handleBack = () => {
    playClick();
    onBack();
  };

  return (
    <header className="w-full bg-jungle-green/80 backdrop-blur-md border-b border-green-800 p-4 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-green-800/50 text-green-400 transition-colors border border-transparent hover:border-green-700"
          title="Back to Map"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col">
          <span className="text-xs text-green-400 uppercase tracking-widest font-bold">Current Level</span>
          <h2 className="text-xl font-bold text-white tracking-wide">{levelName}</h2>
        </div>
        <div className="flex-1 px-8 relative overflow-hidden">
        {/* Decorative Vine Fragment */}
        <div className="absolute top-0 right-1/4 w-32 h-16 pointer-events-none opacity-40">
          <svg viewBox="0 0 100 50" fill="none" className="w-full h-full animate-rustle">
             <path d="M0 0C20 10 40 10 60 5C80 0 100 0 100 0" stroke="#166534" strokeWidth="4"/>
             <ellipse cx="20" cy="8" rx="8" ry="4" fill="#15803d" transform="rotate(10 20 8)"/>
             <ellipse cx="50" cy="10" rx="10" ry="5" fill="#16a34a" transform="rotate(-5 50 10)"/>
             <ellipse cx="80" cy="5" rx="7" ry="3" fill="#22c55e" transform="rotate(15 80 5)"/>
          </svg>
        </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-black/30 rounded-full px-4 py-1.5 border border-green-900/50 text-sm">
          <span className="text-gray-400">Score:</span>
          <span className="font-bold text-glow font-mono text-lg">{score}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Audio Toggle */}
          <button 
            onClick={toggleMute}
            className={`p-2 rounded-full transition-all ${isMuted ? 'text-gray-500 hover:text-gray-300' : 'text-green-400 hover:text-green-300 bg-green-500/10'}`}
            title={isMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
