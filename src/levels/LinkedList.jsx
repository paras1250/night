import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ExplanationPanel from '../components/ExplanationPanel';
import CodeEditor from '../components/CodeEditor';
import SuccessConfetti from '../components/SuccessConfetti';
import { useAudio } from '../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Cpu, RotateCcw, ArrowRight } from 'lucide-react';

const SEQUENCE = [
  { op: 'insert_tail', value: 42, desc: 'Add 42 at the tail' },
  { op: 'insert_head', value: 5, desc: 'Add 5 at the head' },
  { op: 'delete', value: 25, desc: 'Delete node with value 25' },
  { op: 'insert_tail', value: 18, desc: 'Add 18 at the tail' },
  { op: 'insert_head', value: 99, desc: 'Add 99 at the head' },
  { op: 'delete', value: 10, desc: 'Delete head node (10)' },
  { op: 'insert_tail', value: 77, desc: 'Add 77 at the tail' },
  { op: 'insert_head', value: 1, desc: 'Add 1 at the head' },
  { op: 'delete', value: 7, desc: 'Delete node (7)' },
  { op: 'insert_tail', value: 55, desc: 'Add 55 at the tail' },
  { op: 'insert_head', value: 12, desc: 'Add 12 at the head' },
  { op: 'delete', value: 42, desc: 'Delete node (42)' },
  { op: 'insert_tail', value: 3, desc: 'Add 3 at the tail' },
  { op: 'insert_head', value: 8, desc: 'Add 8 at the head' },
  { op: 'insert_tail', value: 20, desc: 'Add 20 at the tail' }
];

const LinkedListLevel = ({ onBack }) => {
  const { playClick, playSuccess } = useAudio();
  const [nodes, setNodes] = useState([
    { id: 1, value: 10 },
    { id: 2, value: 25 },
    { id: 3, value: 7 }
  ]);
  const [opIdx, setOpIdx] = useState(0);
  const [explanation, setExplanation] = useState('Welcome! Add some jungle nodes to your list.');
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [challengeValue, setChallengeValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [mode, setMode] = useState('interactive'); 
  const nextId = useRef(100);

  const reset = () => {
    setNodes([
      { id: 1, value: 10 },
      { id: 2, value: 25 },
      { id: 3, value: 7 }
    ]);
    setOpIdx(0);
    setExplanation('Level reset.');
    setIsComplete(false);
    setHighlightId(null);
    nextId.current = 100;
    setChallengeValue('');
    setShowError(false);
    setIsAutoPlaying(false);
  };

  const handleRunScript = (lines, onError) => {
    onError("Scripting is currently limited in challenge mode.");
  };

  const playStep = (isAuto = false) => {
    if (isComplete) {
      setIsAutoPlaying(false);
      return;
    }
    const op = SEQUENCE[opIdx];

    // Challenge validation UNLESS auto-playing
    if (op.op !== 'delete' && !isAuto) {
      if (parseInt(challengeValue) !== op.value) {
        playClick();
        setShowError(true);
        setTimeout(() => setShowError(false), 500);
        return;
      }
    }

    playClick();
    if (op.op === 'insert_tail') {
      const newNode = { id: nextId.current++, value: op.value };
      setNodes(prev => [...prev, newNode]);
      setHighlightId(newNode.id);
      setExplanation(`Great! Added ${op.value} to the tail.`);
      setChallengeValue('');
    } else if (op.op === 'insert_head') {
      const newNode = { id: nextId.current++, value: op.value };
      setNodes(prev => [newNode, ...prev]);
      setHighlightId(newNode.id);
      setExplanation(`Excellent! Added ${op.value} to the head.`);
      setChallengeValue('');
    } else if (op.op === 'delete') {
      const targetNode = nodes.find(n => n.value === op.value);
      if (targetNode) {
        setHighlightId(targetNode.id);
        setExplanation(`Removing node with value ${targetNode.value}...`);
        setTimeout(() => {
          setNodes(prev => prev.filter(n => n.id !== targetNode.id));
          setHighlightId(null);
        }, 600);
      }
    }

    setScore(s => s + 50);
    const next = opIdx + 1;
    setOpIdx(next);
    if (next >= SEQUENCE.length) {
      playSuccess();
      setIsComplete(true);
      setIsAutoPlaying(false);
    }
  };

  const nextOp = SEQUENCE[opIdx];

  useEffect(() => {
    let timer;
    if (isAutoPlaying && !isComplete) {
      timer = setTimeout(() => {
        playStep(true);
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, opIdx, isComplete]);

  return (
    <div className="min-h-screen flex flex-col bg-jungle-dark text-white font-sans">
      <Header onBack={onBack} levelName="Linked List" score={score} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 min-h-[500px] flex flex-col bg-gradient-to-b from-blue-900/40 to-black/80 border border-blue-800 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-16 bg-black/40 flex items-center justify-between px-6 z-10 border-b border-blue-900/40 font-mono text-sm">
             <div>Linked List Visualization</div>
             <div className="flex gap-4">
               <span className="text-blue-400">Head: {nodes[0]?.value ?? 'NULL'}</span>
               <span className="text-blue-200">Length: {nodes.length}</span>
             </div>
          </div>

          <AnimatePresence>
            {isComplete && (
              <>
                <SuccessConfetti />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/70 z-40 rounded-2xl">
                  <div className="text-center p-8">
                    <div className="text-7xl mb-4 animate-bounce">🏆</div>
                    <h2 className="text-4xl font-extrabold mb-4 text-glow">List Legend!</h2>
                    <button onClick={reset} className="px-8 py-3 bg-blue-500 rounded-xl font-bold hover:bg-blue-400 transition-colors shadow-lg">🔄 Play Again</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 overflow-x-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">HEAD</span>
              <ArrowRight size={14} className="text-blue-400" />
            </div>
            
            <div className="flex items-center gap-0">
              <AnimatePresence mode='popLayout'>
                {nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center gap-0">
                    <motion.div 
                      layout
                      initial={{ scale: 0, opacity: 0, x: -50 }}
                      animate={{ 
                        scale: highlightId === node.id ? 1.1 : 1, 
                        opacity: 1, 
                        x: 0,
                        backgroundColor: highlightId === node.id ? '#1e40af' : '#0f172a'
                      }}
                      exit={{ scale: 0, opacity: 0, x: 50 }}
                      className="w-20 h-20 border-2 border-blue-500 rounded-xl flex items-center justify-center relative shadow-xl z-20"
                    >
                      <span className="text-2xl font-bold font-mono">{node.value}</span>
                      <div className="absolute -bottom-6 text-[10px] text-gray-500">ID: {node.id}</div>
                    </motion.div>
                    {index < nodes.length - 1 && (
                      <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 40 }}
                        className="h-1 bg-blue-800 relative z-10"
                      >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-blue-800" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </AnimatePresence>
              {nodes.length === 0 && <div className="text-gray-500 italic text-lg text-center w-full">List is empty (NULL)</div>}
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-3 max-h-[85vh] md:max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-1">
          <div className="flex bg-black/40 p-1 rounded-xl border border-gray-800">
            <button onClick={() => setMode('interactive')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 ${mode === 'interactive' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>
              <Plus size={14} /> Interactive
            </button>
            <button onClick={() => setMode('code')} className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 ${mode === 'code' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}>
              <Cpu size={14} /> Playground
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {mode === 'interactive' ? (
              <>
                <div className={`bg-black/50 border-2 rounded-2xl p-4 shadow-lg transition-all ${showError ? 'border-red-500 animate-shake' : 'border-blue-800/50'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-800 pb-2 flex justify-between">
                    <span>Tutorial Challenge</span>
                    {nextOp?.op !== 'delete' && <span className="text-blue-400">Value Required</span>}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {nextOp?.op !== 'delete' && (
                       <input 
                        type="number" 
                        value={challengeValue} 
                        onChange={(e) => setChallengeValue(e.target.value)}
                        placeholder={`Enter ${nextOp.value} to push`}
                        className="w-full bg-black/40 border border-blue-900/50 text-white rounded-xl px-3 py-2 font-mono text-center text-lg focus:border-blue-500 outline-none"
                      />
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
                        className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg border-b-4 ${isComplete || isAutoPlaying ? 'bg-gray-800 border-gray-900 text-gray-600' : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg border-b-4 border-blue-700'}`}>
                         {nextOp?.op === 'delete' ? 'Execute Delete' : 'Confirm Entry'}
                      </button>
                    </div>
                    <button onClick={reset} className="py-2.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                      <RotateCcw size={14} /> Restart Level
                    </button>
                  </div>
                </div>

                <div className="bg-black/40 border border-gray-700 rounded-2xl p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
                    <span>Progress</span>
                    <span className="text-blue-400">{Math.round((opIdx / SEQUENCE.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full mb-4 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(opIdx / SEQUENCE.length) * 100}%` }} className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    {SEQUENCE.map((op, i) => (
                      <div key={i} className={`text-[10px] font-mono flex gap-2 items-center ${i < opIdx ? 'text-green-500' : i === opIdx ? 'text-yellow-400' : 'text-gray-600'}`}>
                        <span>{i < opIdx ? '✓' : '○'}</span>
                        <span className="truncate">{op.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <CodeEditor
                onRun={handleRunScript}
                placeholder="insertHead(5)&#10;insertTail(42)&#10;delete(25)"
                examples={['insertHead(5)', 'insertTail(42)', 'delete(10)']}
              />
            )}
            <ExplanationPanel text={explanation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListLevel;
