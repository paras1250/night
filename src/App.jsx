import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import BinarySearchLevel from './levels/BinarySearch';
import StackLevel from './levels/Stack';
import LinkedListLevel from './levels/LinkedList';
import BinaryTreeLevel from './levels/BinaryTree';
import LoadingScreen from './components/LoadingScreen';
import JungleDecoration from './components/JungleDecoration';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  const handleLevelSelect = (level) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentScreen(level);
      setIsLoading(false);
    }, 1200);
  };

  const handleBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentScreen('home');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-jungle-dark min-h-screen relative overflow-hidden jungle-gradient">
      <JungleDecoration />
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-full"
        >
          {currentScreen === 'home' && <Home onSelectLevel={handleLevelSelect} />}
          {currentScreen === 'binary-search' && <BinarySearchLevel onBack={handleBack} />}
          {currentScreen === 'stack' && <StackLevel onBack={handleBack} />}
          {currentScreen === 'linked-list' && <LinkedListLevel onBack={handleBack} />}
          {currentScreen === 'binary-tree' && <BinaryTreeLevel onBack={handleBack} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
