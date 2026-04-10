import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser policies
  const [isPlaying, setIsPlaying] = useState(false);
  
  const bgMusicRef = useRef(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3')); // Relaxing ambient logic
  const clickSfxRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));
  const successSfxRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'));

  useEffect(() => {
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.3;
    
    if (!isMuted && isPlaying) {
      bgMusicRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
      bgMusicRef.current.pause();
    }
  }, [isMuted, isPlaying]);

  const toggleMute = () => {
    if (isMuted) setIsPlaying(true);
    setIsMuted(!isMuted);
  };

  const playClick = () => {
    if (!isMuted) {
      clickSfxRef.current.currentTime = 0;
      clickSfxRef.current.play().catch(() => {});
    }
  };

  const playSuccess = () => {
    if (!isMuted) {
      successSfxRef.current.currentTime = 0;
      successSfxRef.current.play().catch(() => {});
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playClick, playSuccess }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
