import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ExplanationPanel from '../components/ExplanationPanel';
import CodeEditor from '../components/CodeEditor';
import SuccessConfetti from '../components/SuccessConfetti';
import { useAudio } from '../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Timer, Trophy, Cpu, Plus } from 'lucide-react';

const DEFAULT_ARRAY = Array.from({ length: 15 }, (_, i) => (i + 1) * 7); // [7, 14, 21, ..., 105]
const SEARCH_TARGETS = [35, 77, 14]; // Multiple targets to reach 15 steps

const generateAllSteps = () => {
  const allSteps = [];
  SEARCH_TARGETS.forEach(target => {
    let l = 0, r = DEFAULT_ARRAY.length - 1;
    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      allSteps.push({ left: l, right: r, mid: m, value: DEFAULT_ARRAY[m], target });
      if (DEFAULT_ARRAY[m] === target) break;
      else if (DEFAULT_ARRAY[m] < target) l = m + 1;
      else r = m - 1;
    }
  });
  return allSteps;
};

const BinarySearchLevel = ({ onBack }) => {
  const { playClick, playSuccess } = useAudio();
  const [array] = useState(DEFAULT_ARRAY);
  const [steps] = useState(generateAllSteps());
  const [stepIdx, setStepIdx] = useState(-1);
  const [status, setStatus] = useState('ready');
  const [birdHint, setBirdHint] = useState(null);
  const [explanation, setExplanation] = useState('Welcome! Find the rabbits hiding in the bushes. 🐰');
  const [score, setScore] = useState(0);
  const [challengeValue, setChallengeValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [mode, setMode] = useState('interactive');
  const autoRef = useRef(null);

  const resetGame = () => {
    setStepIdx(-1);
    setStatus('ready');
    setBirdHint(null);
    setExplanation('Welcome! Find the rabbits hiding in the bushes. 🐰');
    setChallengeValue('');
    setIsAutoPlaying(false);
  };

  const handleRunScript = (lines, onError) => {
    // Basic script runner for demonstration
    onError("Scripting is currently limited in challenge mode.");
  };

  const playStep = (isAuto = false) => {
    const nextIdx = stepIdx + 1;
    if (nextIdx >= steps.length) {
      setStatus('won');
      setIsAutoPlaying(false);
      return;
    }

    const s = steps[nextIdx];
    // Challenge: User must enter the MID value UNLESS auto-playing
    if (parseInt(challengeValue) !== s.value && !isAuto) {
      playClick();
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      return;
    }

    playClick();
    setStepIdx(nextIdx);
    setChallengeValue('');

    if (s.value === s.target) {
      playSuccess();
      setBirdHint(`🎊 Found ${s.target}!`);
      setScore(prev => prev + 100);
      setExplanation(`Target ${s.target} located! Moving to next target if any.`);
    } else {
      setBirdHint(s.value < s.target ? '👉 Go right!' : '👈 Go left!');
      setExplanation(`Checking ${s.value}... ${s.value < s.target ? 'too small' : 'too big'}.`);
    }

    if (nextIdx === steps.length - 1) {
      setStatus('won');
    }
  };


  const isOver = status === 'won' || status === 'not_found';

  useEffect(() => {
    let timer;
    if (isAutoPlaying && !isOver) {
      timer = setTimeout(() => {
        playStep(true);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, stepIdx, isOver]);

  const currentStep = steps[stepIdx] ?? null;
  const activeLeft = currentStep?.left ?? 0;
  const activeRight = currentStep?.right ?? array.length - 1;
  const progress = Math.min(100, Math.round(((stepIdx + 1) / steps.length) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-jungle-dark text-white font-sans">
      <Header onBack={onBack} levelName="Binary Search" score={score} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 min-h-[400px] flex flex-col bg-gradient-to-b from-green-900/60 to-black/80 border border-green-800 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-16 bg-black/40 flex items-center justify-between px-6 z-10 border-b border-green-900/40 font-mono text-sm">
            <div>Current Target: <span className="text-green-400 font-bold">{steps[stepIdx + 1]?.target || steps[stepIdx]?.target}</span></div>
            <div className="flex gap-4">
              <span className="text-blue-400">L={activeLeft}</span>
              <span className="text-yellow-400">M={steps[stepIdx + 1]?.mid ?? '?'}</span>
              <span className="text-red-400">R={activeRight}</span>
            </div>
          </div>

          <AnimatePresence>
            {isOver && (
              <>
                <SuccessConfetti />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/70 z-40 rounded-2xl">
                  <div className="text-center p-8">
                    <div className="text-7xl mb-4 animate-bounce">🏆</div>
                    <h2 className="text-4xl font-extrabold mb-4 text-glow">Search Master!</h2>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-green-500 rounded-xl font-bold hover:bg-green-400 transition-colors">🔄 Play Again</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1 flex items-end justify-center pb-12 px-2 relative z-10">
            <div className="flex items-end gap-2 flex-wrap justify-center">
              {array.map((value, idx) => {
                const isEliminated = stepIdx >= 0 && (idx < activeLeft || idx > activeRight);
                const isMid = steps[stepIdx + 1]?.mid === idx;
                const isFound = steps[stepIdx]?.value === steps[stepIdx]?.target && steps[stepIdx]?.mid === idx;
                return (
                  <motion.div key={idx} animate={{ opacity: isEliminated ? 0.2 : 1, scale: isMid || isFound ? 1.1 : 1 }} className="relative flex flex-col items-center w-16">
                    <AnimatePresence mode='wait'>
                      {isMid && (
                        <motion.div layoutId="fox-mascot" className="text-4xl absolute bottom-full mb-1">🦊</motion.div>
                      )}
                    </AnimatePresence>
                    {isFound && <motion.div layoutId="fox-mascot" className="text-3xl absolute bottom-full mb-1">🦊🐰</motion.div>}
                    <div className="text-xs font-mono font-bold mb-1">{value}</div>
                    <div className="text-5xl">{isFound ? '🌸' : '🌿'}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-3 pr-1 max-h-[85vh] md:max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
          <div className="bg-black/50 border border-green-800/50 rounded-2xl p-4 shadow-lg">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
              <span>Search Progress</span>
              <span className="text-green-400">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full mb-2 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-green-600 to-emerald-400" />
            </div>
          </div>

          <div className="flex bg-black/40 p-1 rounded-xl border border-gray-800">
            <button onClick={() => setMode('interactive')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 ${mode === 'interactive' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500'}`}>
              <Plus size={14} /> Interactive
            </button>
            <button onClick={() => setMode('code')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 ${mode === 'code' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}>
              <Cpu size={14} /> Playground
            </button>
          </div>

          {mode === 'interactive' ? (
            <>
              <div className={`bg-black/50 border-2 rounded-2xl p-4 shadow-lg flex flex-col gap-2 transition-all ${showError ? 'border-red-500 animate-shake' : 'border-green-800/50'}`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                  <span>Search Challenge</span>
                  <span className="text-green-400">Identify Mid Value</span>
                </h3>

                {!isOver && (
                  <input
                    type="number"
                    value={challengeValue}
                    onChange={(e) => setChallengeValue(e.target.value)}
                    placeholder="Enter value at FOX 🦊"
                    className="w-full bg-black/40 border border-green-900/50 text-white rounded-xl px-3 py-2 font-mono text-center text-lg focus:border-green-500 outline-none"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    disabled={isOver}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-all border-b-4 ${isAutoPlaying ? 'bg-red-600 border-red-800 text-white' : 'bg-jungle-leaf border-jungle-deep text-white'}`}
                  >
                    {isAutoPlaying ? '⏹ Stop' : '🚀 Auto Play'}
                  </button>
                  <button
                    onClick={() => playStep(false)}
                    disabled={isOver || isAutoPlaying}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg border-b-4 ${isOver || isAutoPlaying ? 'bg-gray-800 border-gray-900 text-gray-600' : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white border-green-800'}`}
                  >
                    Confirm Jump
                  </button>
                </div>
                <button onClick={() => window.location.reload()} className="w-full py-2 bg-gray-800 text-white rounded-xl font-bold text-sm border border-gray-700">Restart Level</button>
              </div>
              <ExplanationPanel text={explanation} />
              {birdHint && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3 animate-pulse">
                  <span className="text-3xl">🐦</span>
                  <p className="text-sm italic font-bold text-green-300">{birdHint}</p>
                </div>
              )}
            </>
          ) : (
            <CodeEditor
              onRun={handleRunScript}
              placeholder="search(35)&#10;reset()"
              examples={['search(20)', 'reset()']}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BinarySearchLevel;
