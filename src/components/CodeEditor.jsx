import React, { useState } from 'react';
import { Play, ClipboardList, Info } from 'lucide-react';

const CodeEditor = ({ onRun, placeholder, examples = [] }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const handleRun = () => {
    setError(null);
    if (!code.trim()) {
      setError('Please enter some commands first!');
      return;
    }
    
    // Split by lines or semicolons
    const lines = code.split(/[\n;]+/).map(l => l.trim()).filter(Boolean);
    onRun(lines, (errMsg) => setError(errMsg));
  };

  return (
    <div className="flex flex-col gap-3 bg-black/40 border-2 border-purple-900/30 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
          <Terminal size={14} /> Code Playground
        </h3>
        {examples.length > 0 && (
          <div className="group relative">
            <ClipboardList size={14} className="text-gray-500 cursor-help hover:text-purple-400 transition-colors" />
            <div className="absolute right-0 top-6 w-48 bg-gray-900 border border-purple-800 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl">
              <p className="text-[10px] text-purple-300 mb-2 font-bold uppercase tracking-tight">Examples:</p>
              {examples.map((ex, i) => (
                <div key={i} className="text-[10px] font-mono text-gray-400 mb-1 leading-tight">{ex}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative font-mono text-sm">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/30 rounded-l-lg border-r border-gray-800 flex flex-col items-center pt-3 text-[10px] text-gray-600 select-none">
          {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={placeholder || 'Enter commands...'}
          className="w-full h-40 bg-black/20 text-green-400 pl-10 pr-3 py-3 rounded-lg border border-purple-900/20 focus:outline-none focus:border-purple-500/50 resize-none custom-scrollbar transition-all"
          spellCheck="false"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-[11px] text-red-400 bg-red-900/20 p-2 rounded-lg border border-red-900/30 animate-pulse">
          <Info size={12} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleRun}
        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group"
      >
        <Play size={14} className="fill-current group-hover:scale-110 transition-transform" />
        Visualize Commands
      </button>

      <div className="text-[10px] text-gray-500 italic px-1">
        Tip: You can use ; to separate commands on the same line.
      </div>
    </div>
  );
};

const Terminal = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export default CodeEditor;
