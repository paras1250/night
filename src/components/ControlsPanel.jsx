import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

const ControlsPanel = ({ onPlayStep, onReset, isWon, isAutoPlaying, onToggleAutoPlay }) => {
  return (
    <div className="bg-black/40 backdrop-blur-md border-2 border-green-800/50 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-800 pb-2">
        Controls
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onPlayStep}
          disabled={isWon || isAutoPlaying}
          className={`col-span-2 py-3 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all 
            ${isWon || isAutoPlaying ? 'bg-gray-700/50 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 hover:shadow-[0_0_15px_rgba(126,217,87,0.4)] active:scale-95 border-b-4 border-green-700 active:border-b-0 active:translate-y-1'}`}
        >
          <Play size={20} fill="currentColor" /> {isWon ? "Level Complete!" : "Play Step"}
        </button>
        
        <button 
          onClick={onToggleAutoPlay}
          disabled={isWon}
          className={`py-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 border 
            ${isWon ? 'bg-gray-800 text-gray-600 border-gray-700 opacity-50 cursor-not-allowed' : (isAutoPlaying ? 'bg-green-900/50 text-glow border-glow shadow-[0_0_10px_rgba(126,217,87,0.3)]' : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700 active:scale-95')}`}
        >
          {isAutoPlaying ? <Pause size={18} /> : <SkipForward size={18} />} 
          {isAutoPlaying ? "Pause" : "Auto Play"}
        </button>

        <button 
          onClick={onReset}
          className="py-3 bg-gray-800 hover:bg-red-900/40 hover:text-red-400 text-white rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 active:scale-95 border border-gray-700 hover:border-red-800/50">
          <RotateCcw size={18} /> Reset
        </button>
      </div>

      <div className="mt-6">
        <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Animation Speed</label>
        <input 
          type="range" 
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
          min="1" max="3" defaultValue="2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Slow</span>
          <span>Normal</span>
          <span>Fast</span>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
