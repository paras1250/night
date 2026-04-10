import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import ExplanationPanel from '../components/ExplanationPanel';
import CodeEditor from '../components/CodeEditor';
import SuccessConfetti from '../components/SuccessConfetti';
import { useAudio } from '../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Trash2, Cpu } from 'lucide-react';

const PREDEFINED_SEQUENCE = [
  { op: 'push', value: 10 },
  { op: 'push', value: 25 },
  { op: 'push', value: 7 },
  { op: 'push', value: 33 },
  { op: 'pop' },
  { op: 'push', value: 18 },
  { op: 'pop' },
  { op: 'pop' },
  { op: 'push', value: 42 },
  { op: 'push', value: 12 },
  { op: 'push', value: 99 },
  { op: 'pop' },
  { op: 'push', value: 55 },
  { op: 'pop' },
  { op: 'pop' }
];

const PLATE_COLORS = [
  'from-red-600 to-red-400',
  'from-orange-600 to-orange-400',
  'from-yellow-600 to-yellow-400',
  'from-green-600 to-green-400',
  'from-blue-600 to-blue-400',
  'from-purple-600 to-purple-400',
  'from-pink-600 to-pink-400',
  'from-teal-600 to-teal-400',
];

const StackLevel = ({ onBack }) => {
  const { playClick, playSuccess } = useAudio();
  const [stack, setStack] = useState([]);
  const [opIndex, setOpIndex] = useState(0);
  const [explanation, setExplanation] = useState('Welcome! 🥞 This is a Stack. Press Play Step to watch Push/Pop in action.');
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [challengeValue, setChallengeValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [colorMap, setColorMap] = useState({});
  const [colorIdx, setColorIdx] = useState(0);
  const [mode, setMode] = useState('interactive'); // 'interactive' or 'code'

  const getColor = (value) => {
    if (!colorMap[value]) {
      const color = PLATE_COLORS[colorIdx % PLATE_COLORS.length];
      setColorMap(prev => ({ ...prev, [value]: color }));
      setColorIdx(i => i + 1);
      return color;
    }
    return colorMap[value];
  };

  const reset = () => {
    setStack([]);
    setOpIndex(0);
    setExplanation('Stack reset! Press ▶ Play Step to start again.');
    setScore(0);
    setIsComplete(false);
    setColorMap({});
    setColorIdx(0);
    setChallengeValue('');
    setIsAutoPlaying(false);
  };

  const handleRunScript = (lines, onError) => {
    const newSteps = [];
    let tempStackCount = stack.length;

    for (const line of lines) {
      const pushMatch = line.match(/^push\(?(\d+)\)?$/i);
      const popMatch = line.match(/^pop(\(\))?$/i);

      if (pushMatch) {
        const val = parseInt(pushMatch[1]);
        if (tempStackCount >= 8) {
          onError(`Stack overflow at "${line}"! Max size is 8.`);
          return;
        }
        tempStackCount++;
        newSteps.push({ op: 'push', value: val, explanation: `Code command triggered a Push of ${val}.` });
      } else if (popMatch) {
        if (tempStackCount === 0) {
          onError(`Stack underflow at "${line}"! Cannot pop from empty stack.`);
          return;
        }
        tempStackCount--;
        newSteps.push({ op: 'pop', explanation: 'Code command triggered a Pop operation.' });
      } else {
        onError(`Unknown command: "${line}". Use push(val) or pop().`);
        return;
      }
    }

    // Execute sequence
    let i = 0;
    const interval = setInterval(() => {
      if (i >= newSteps.length) {
        clearInterval(interval);
        return;
      }
      const s = newSteps[i];
      if (s.op === 'push') {
        const color = getColor(s.value);
        setStack(prev => [...prev, { value: s.value, color }]);
      } else {
        setStack(prev => prev.slice(0, -1));
      }
      setExplanation(s.explanation);
      setScore(prev => prev + 50);
      i++;
    }, 800);
  };

  const playStep = (isAuto = false) => {
    if (isComplete) {
      setIsAutoPlaying(false);
      return;
    }
    const currentStep = PREDEFINED_SEQUENCE[opIndex];
    
    // If step requires a value, we must check the challenge input UNLESS auto-playing
    if (currentStep.op === 'push' && !isAuto) {
      if (parseInt(challengeValue) !== currentStep.value) {
        playClick();
        setShowError(true);
        setTimeout(() => setShowError(false), 500);
        return;
      }
    }

    playClick();
    if (currentStep.op === 'push') {
      const color = getColor(currentStep.value);
      setStack(prev => [...prev, { value: currentStep.value, color }]);
      setExplanation(`Great! You pushed ${currentStep.value} onto the stack.`);
      setScore(s => s + 20);
      setChallengeValue('');
    } else {
      const top = stack[stack.length - 1];
      setStack(prev => prev.slice(0, -1));
      setExplanation(`Excellent! You popped ${top.value} from the top.`);
      setScore(s => s + 30);
    }
    
    setOpIndex(opIndex + 1);
    if (opIndex + 1 >= PREDEFINED_SEQUENCE.length) {
      playSuccess();
      setIsComplete(true);
      setIsAutoPlaying(false);
    }
  };

  useEffect(() => {
    let timer;
    if (isAutoPlaying && !isComplete) {
      timer = setTimeout(() => {
        playStep(true);
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, opIndex, isComplete]);

  const manualPush = () => {
    const val = parseInt(customValue);
    if (isNaN(val)) return;
    if (stack.length >= 8) {
      setExplanation('⚠️ Stack Overflow! Max 8 plates allowed.');
      return;
    }
    const color = getColor(val);
    setStack(prev => [...prev, { value: val, color }]);
    setExplanation(`📥 PUSH ${val} onto the stack!`);
    setCustomValue('');
  };

  const manualPop = () => {
    if (stack.length === 0) {
      setExplanation('⚠️ Stack is empty! Cannot pop — Stack Underflow!');
      return;
    }
    const top = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    setExplanation(`📤 POP! Removed ${top.value} from the top.`);
  };

  const nextOp = PREDEFINED_SEQUENCE[opIndex];

  return (
    <div className="min-h-screen flex flex-col bg-jungle-dark text-white font-sans">
      <Header onBack={onBack} levelName="Stack Operations" score={score} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* Game Area */}
        <div className="flex-1 min-h-[500px] flex flex-col bg-jungle-green/40 border border-green-800 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 via-transparent to-black/50 pointer-events-none z-0" />

          {/* Win Overlay */}
          <AnimatePresence>
            {isComplete && (
              <>
                <SuccessConfetti />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/70 z-40 rounded-2xl"
                >
                  <div className="text-center p-8">
                    <div className="text-8xl mb-4 animate-bounce">🏆</div>
                    <h2 className="text-4xl font-extrabold text-glow mb-2">Stack Master!</h2>
                    <p className="text-gray-300 text-xl mb-6">All operations complete. Score: {score}</p>
                    <button onClick={reset} className="px-8 py-3 bg-green-500 hover:bg-green-400 rounded-xl font-bold text-lg">
                      🔄 Play Again
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Stack Visualization */}
          <div className="flex-1 flex items-end justify-center gap-12 px-8 pb-10 relative z-10">
            <div className="flex flex-col items-center">
              <div className="text-sm font-mono text-gray-400 mb-4 uppercase tracking-widest">Stack (Top → Bottom)</div>

              <div className="relative flex flex-col-reverse items-center">
                {/* Monkey mascot */}
                <motion.div
                  animate={{ bottom: (stack.length * 48) + 16 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute left-20 text-6xl z-30 animate-bounce pointer-events-none"
                >
                  🐒
                </motion.div>

                <div className="w-64 h-4 bg-gradient-to-r from-amber-800 to-amber-600 rounded-b-xl border-b-4 border-amber-900 shadow-2xl" />

                <div className="flex flex-col-reverse items-center w-64">
                  <AnimatePresence>
                    {stack.map((plate, idx) => {
                      const isTop = idx === stack.length - 1;
                      return (
                        <motion.div
                          key={`${plate.value}-${idx}`}
                          initial={{ y: -60, opacity: 0, scale: 0.8 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ y: -60, opacity: 0, scale: 0.8, x: 30 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className={`w-56 h-12 rounded-lg bg-gradient-to-r ${plate.color} flex items-center justify-center font-mono font-bold text-xl text-white shadow-lg border-b-4 border-black/20 
                            ${isTop ? 'ring-2 ring-white/50 ring-offset-1 ring-offset-transparent' : ''}`}
                        >
                          {plate.value}
                          {isTop && <span className="ml-3 text-xs bg-white/20 px-2 py-0.5 rounded-full">TOP</span>}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {stack.length === 0 && <div className="text-gray-500 text-sm py-8 italic">Stack is empty...</div>}
              </div>
              <div className="mt-2 text-xs text-gray-500 font-mono">Size: {stack.length} / 8</div>
            </div>

            {/* Next Op Preview */}
            <div className="flex flex-col gap-4">
              <div className="bg-black/40 border border-gray-700 rounded-2xl p-5 w-48">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Next Operation</div>
                {!isComplete && nextOp ? (
                  <div className={`text-2xl font-bold ${nextOp.op === 'push' ? 'text-green-400' : 'text-red-400'}`}>
                    {nextOp.op === 'push' ? '📥 PUSH' : '📤 POP'}
                    {nextOp.value && <div className="text-4xl mt-2 text-white font-mono">{nextOp.value}</div>}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">All done! ✅</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 flex flex-col gap-3 max-h-[85vh] md:max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-1">
          <div className="flex bg-black/40 p-1 rounded-xl border border-gray-800">
            <button onClick={() => setMode('interactive')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'interactive' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500'}`}>
              <Plus size={14} /> Interactive
            </button>
            <button onClick={() => setMode('code')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'code' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}>
              <Cpu size={14} /> Playground
            </button>
          </div>

          {mode === 'interactive' ? (
            <>
              <div className="bg-black/50 border-2 border-amber-800/50 rounded-2xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-800 pb-2">Manual Controls</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input type="number" value={customValue} onChange={(e) => setCustomValue(e.target.value)} placeholder="Val" className="w-20 bg-black/40 border border-amber-900/50 text-white rounded-xl px-3 font-mono" />
                    <button onClick={manualPush} className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm">Push</button>
                  </div>
                  <button onClick={manualPop} className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm">Pop</button>
                </div>
              </div>

                <div className={`bg-black/50 border-2 rounded-2xl p-4 transition-all ${showError ? 'border-red-500 animate-shake' : 'border-orange-800/50'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-800 pb-2 flex justify-between">
                    <span>Tutorial Challenge</span>
                    {PREDEFINED_SEQUENCE[opIndex]?.op === 'push' && <span className="text-orange-400">Value Required</span>}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {PREDEFINED_SEQUENCE[opIndex]?.op === 'push' && (
                      <div className="relative">
                         <input 
                          type="number" 
                          value={challengeValue} 
                          onChange={(e) => setChallengeValue(e.target.value)}
                          placeholder={`Enter ${PREDEFINED_SEQUENCE[opIndex].value} to push`}
                          className="w-full bg-black/40 border border-orange-900/50 text-white rounded-xl px-3 py-2 font-mono text-center text-lg focus:border-orange-500 outline-none"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)} 
                        disabled={isComplete} 
                        className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-all border-b-4 ${isAutoPlaying ? 'bg-red-600 border-red-800 text-white' : 'bg-jungle-leaf border-jungle-deep text-white'}`}
                      >
                        {isAutoPlaying ? '⏹ Stop' : '🚀 Auto Play'}
                      </button>
                      <button 
                        onClick={() => playStep(false)} 
                        disabled={isComplete || isAutoPlaying} 
                        className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg border-b-4 ${isComplete || isAutoPlaying ? 'bg-gray-800 border-gray-900 text-gray-600' : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white border-orange-800'}`}
                      >
                         {PREDEFINED_SEQUENCE[opIndex]?.op === 'pop' ? 'Execute Pop' : 'Confirm Push'}
                      </button>
                    </div>
                    <button onClick={reset} className="py-2.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl font-bold text-sm">Restart Level</button>
                  </div>
                </div>

              <div className="bg-black/40 border border-gray-700 rounded-2xl p-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
                  <span>Progress</span>
                  <span className="text-orange-400">{Math.round((opIndex / PREDEFINED_SEQUENCE.length) * 100)}%</span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-800 rounded-full mb-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(opIndex / PREDEFINED_SEQUENCE.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-orange-600 to-amber-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  {PREDEFINED_SEQUENCE.map((op, i) => (
                    <div key={i} className={`text-[10px] font-mono flex gap-2 items-center ${i < opIndex ? 'text-green-500' : i === opIndex ? 'text-yellow-400' : 'text-gray-600'}`}>
                      <span>{i < opIndex ? '✓' : '○'}</span>
                      <span className="truncate">{op.op.toUpperCase()} {op.value || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <CodeEditor
              onRun={handleRunScript}
              placeholder="push(10)&#10;push(20)&#10;pop()"
              examples={['push(10)', 'pop()', 'push(5); push(10); pop()']}
            />
          )}

          <ExplanationPanel text={explanation} />
        </div>
      </div>
    </div>
  );
};

export default StackLevel;
