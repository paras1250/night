import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ExplanationPanel from '../components/ExplanationPanel';
import CodeEditor from '../components/CodeEditor';
import SuccessConfetti from '../components/SuccessConfetti';
import { useAudio } from '../context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Play, Cpu, Plus } from 'lucide-react';

const treeData = {
  id: 1, value: 50, x: 50, y: 10,
  left: {
    id: 2, value: 30, x: 25, y: 30,
    left: { 
      id: 4, value: 20, x: 12, y: 50,
      left: { id: 8, value: 10, x: 6, y: 75 },
      right: { id: 9, value: 25, x: 18, y: 75 }
    },
    right: { 
      id: 5, value: 40, x: 38, y: 50,
      left: { id: 10, value: 35, x: 32, y: 75 },
      right: { id: 11, value: 45, x: 44, y: 75 }
    }
  },
  right: {
    id: 3, value: 70, x: 75, y: 30,
    left: { 
      id: 6, value: 60, x: 62, y: 50,
      left: { id: 12, value: 55, x: 56, y: 75 },
      right: { id: 13, value: 65, x: 68, y: 75 }
    },
    right: { 
      id: 7, value: 80, x: 88, y: 50,
      left: { id: 14, value: 75, x: 82, y: 75 },
      right: { id: 15, value: 90, x: 94, y: 75 }
    }
  }
};

const flattenNodes = (node, arr = []) => {
  if (!node) return arr;
  arr.push(node);
  flattenNodes(node.left, arr);
  flattenNodes(node.right, arr);
  return arr;
};

const allNodes = flattenNodes(treeData);

const getPreorder = (node, arr = []) => {
  if (!node) return arr;
  arr.push(node.id);
  getPreorder(node.left, arr);
  getPreorder(node.right, arr);
  return arr;
};

const getInorder = (node, arr = []) => {
  if (!node) return arr;
  getInorder(node.left, arr);
  arr.push(node.id);
  getInorder(node.right, arr);
  return arr;
};

const getPostorder = (node, arr = []) => {
  if (!node) return arr;
  getPostorder(node.left, arr);
  getPostorder(node.right, arr);
  arr.push(node.id);
  return arr;
};

const BinaryTreeLevel = ({ onBack }) => {
  const { playClick, playSuccess } = useAudio();
  const [traversalType, setTraversalType] = useState('inorder');
  const [sequence, setSequence] = useState(getInorder(treeData));
  const [stepIdx, setStepIdx] = useState(-1);
  const [visited, setVisited] = useState([]);
  const [explanation, setExplanation] = useState('Welcome! Guide the bird through the branches. 🐦');
  const [score, setScore] = useState(0);
  const [challengeValue, setChallengeValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [mode, setMode] = useState('interactive'); 

  const activeNodeId = stepIdx >= 0 && stepIdx < sequence.length ? sequence[stepIdx] : null;
  const progress = Math.min(100, Math.round(((stepIdx + 1) / sequence.length) * 100));

  useEffect(() => {
    let seq = [];
    if (traversalType === 'preorder') seq = getPreorder(treeData);
    if (traversalType === 'inorder') seq = getInorder(treeData);
    if (traversalType === 'postorder') seq = getPostorder(treeData);
    setSequence(seq);
    setStepIdx(-1);
    setVisited([]);
  }, [traversalType]);

  const handleRunScript = (lines, onError) => {
    for (const line of lines) {
      const travMatch = line.match(/^traverse\(?['"]?(\w+)['"]?\)?$/i);
      const resetMatch = line.match(/^reset(\(\))?$/i);

      if (travMatch) {
        const type = travMatch[1].toLowerCase();
        if (['inorder', 'preorder', 'postorder'].includes(type)) {
          setTraversalType(type);
          let i = -1;
          const interval = setInterval(() => {
            if (i >= sequence.length - 1) {
              clearInterval(interval);
              playSuccess();
              return;
            }
            playClick();
            i++;
            setStepIdx(i);
            setVisited(prev => [...prev, sequence[i]]);
            setScore(s => s + 50);
          }, 800);
        } else {
          onError(`Invalid traversal: "${type}". Use inorder, preorder, or postorder.`);
          return;
        }
      } else if (resetMatch) {
        reset();
      } else {
        onError(`Unknown command: "${line}". Use traverse('type') or reset().`);
        return;
      }
    }
  };

  const playStep = (isAuto = false) => {
    const nextIdx = stepIdx + 1;
    if (nextIdx >= sequence.length) {
      setIsAutoPlaying(false);
      return;
    }
    
    const nextNodeId = sequence[nextIdx];
    const nextNode = allNodes.find(n => n.id === nextNodeId);

    // Challenge: User must enter node value UNLESS auto-playing
    if (parseInt(challengeValue) !== nextNode.value && !isAuto) {
      playClick();
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      return;
    }

    playClick();
    setStepIdx(nextIdx);
    setVisited(prev => [...prev, nextNodeId]);
    setScore(s => s + 50);
    setChallengeValue('');
    if (nextIdx === sequence.length - 1) {
      playSuccess();
      setIsAutoPlaying(false);
    }
  };


  const reset = () => {
    setStepIdx(-1);
    setVisited([]);
    setScore(0);
    setExplanation(`Reset ${traversalType.toUpperCase()} traversal.`);
    setIsAutoPlaying(false);
  };

  const isComplete = stepIdx >= sequence.length - 1;

  useEffect(() => {
    let timer;
    if (isAutoPlaying && !isComplete) {
      timer = setTimeout(() => {
        playStep(true);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, stepIdx, isComplete]);

  return (
    <div className="min-h-screen flex flex-col bg-jungle-dark text-white font-sans">
      <Header onBack={onBack} levelName="Binary Tree" score={score} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 min-h-[500px] flex flex-col bg-gradient-to-b from-green-900/40 to-black/80 border border-green-800 rounded-2xl shadow-2xl relative overflow-hidden">
          <AnimatePresence>
            {isComplete && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40">
                <SuccessConfetti />
                <div className="w-full h-full flex items-center justify-center bg-black/70 rounded-2xl">
                  <div className="text-center p-8">
                    <div className="text-7xl mb-4 animate-bounce">🏆</div>
                    <h2 className="text-4xl font-extrabold mb-4 text-glow font-mono">Tree Master!</h2>
                    <button onClick={reset} className="px-8 py-3 bg-green-500 rounded-xl font-bold hover:bg-green-400 transition-colors">🔄 Try Again</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 relative mt-[10%] mb-[10%] mx-[5%]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <line x1="50%" y1="10%" x2="25%" y2="30%" stroke="#166534" strokeWidth="4" />
              <line x1="50%" y1="10%" x2="75%" y2="30%" stroke="#166534" strokeWidth="4" />
              
              <line x1="25%" y1="30%" x2="12%" y2="50%" stroke="#166534" strokeWidth="3" />
              <line x1="25%" y1="30%" x2="38%" y2="50%" stroke="#166534" strokeWidth="3" />
              
              <line x1="75%" y1="30%" x2="62%" y2="50%" stroke="#166534" strokeWidth="3" />
              <line x1="75%" y1="30%" x2="88%" y2="50%" stroke="#166534" strokeWidth="3" />

              <line x1="12%" y1="50%" x2="6%" y2="75%" stroke="#166534" strokeWidth="2" />
              <line x1="12%" y1="50%" x2="18%" y2="75%" stroke="#166534" strokeWidth="2" />
              
              <line x1="38%" y1="50%" x2="32%" y2="75%" stroke="#166534" strokeWidth="2" />
              <line x1="38%" y1="50%" x2="44%" y2="75%" stroke="#166534" strokeWidth="2" />

              <line x1="62%" y1="50%" x2="56%" y2="75%" stroke="#166534" strokeWidth="2" />
              <line x1="62%" y1="50%" x2="68%" y2="75%" stroke="#166534" strokeWidth="2" />

              <line x1="88%" y1="50%" x2="82%" y2="75%" stroke="#166534" strokeWidth="2" />
              <line x1="88%" y1="50%" x2="94%" y2="75%" stroke="#166534" strokeWidth="2" />
            </svg>

            {allNodes.map(node => {
              const isVisited = visited.includes(node.id);
              const isActive = activeNodeId === node.id;
              return (
                <motion.div key={node.id} animate={{ scale: isActive ? 1.2 : 1 }} className="absolute p-4 w-16 h-16 -ml-8 -mt-8 rounded-full flex items-center justify-center font-bold border-4" style={{ left: `${node.x}%`, top: `${node.y}%`, backgroundColor: isActive ? '#facc15' : isVisited ? '#16a34a' : '#064e3b', borderColor: isActive ? '#fef08a' : isVisited ? '#4ade80' : '#047857', zIndex: isActive ? 20 : 10 }}>
                  <span className={isActive ? 'text-black' : 'text-white'}>{node.value}</span>
                  <AnimatePresence>
                    {isActive && <motion.div layoutId="tree-bird" className="absolute text-5xl z-30" animate={{ y: -45 }}>🐦</motion.div>}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-3 pr-1 max-h-[85vh] md:max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
          <div className="bg-black/50 border border-green-800/50 rounded-2xl p-4 shadow-lg">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
              <span>Traversal Progress</span>
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
                  <span>Tree Challenge</span>
                  <span className="text-green-400">Node Entry</span>
                </h3>
                
                {!isComplete && (
                  <input 
                    type="number" 
                    value={challengeValue}
                    onChange={(e) => setChallengeValue(e.target.value)}
                    placeholder="Enter next node value"
                    className="w-full bg-black/40 border border-green-900/50 text-white rounded-xl px-3 py-2 font-mono text-center text-lg focus:border-green-500 outline-none"
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
                    className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg border-b-4 ${isComplete || isAutoPlaying ? 'bg-gray-800 border-gray-900 text-gray-600' : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white border-green-800'}`}
                  >
                     Hop Bird
                  </button>
                </div>
                <button onClick={() => window.location.reload()} className="py-2 bg-gray-800 text-white rounded-xl font-bold text-sm border border-gray-700">Restart Level</button>
              </div>
              <div className="bg-black/40 border border-green-800/40 rounded-2xl p-4">
                <h3 className="text-xs font-bold uppercase text-green-400 mb-2">Traversal Type</h3>
                <div className="flex flex-col gap-1">
                  {['preorder', 'inorder', 'postorder'].map(t => (
                    <button key={t} onClick={() => setTraversalType(t)} className={`py-2 px-3 rounded-lg text-sm font-bold transition-colors ${traversalType === t ? 'bg-green-600' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{t.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <CodeEditor
              onRun={handleRunScript}
              placeholder="traverse('inorder')&#10;reset()"
              examples={["traverse('preorder')", "reset()"]}
            />
          )}

          <ExplanationPanel text={explanation} />
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeLevel;
