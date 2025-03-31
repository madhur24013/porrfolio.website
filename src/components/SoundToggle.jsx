import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SoundToggle = () => {
  // Check if sound is enabled in localStorage (default is true)
  const getInitialSoundState = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const soundEnabled = window.localStorage.getItem('soundEnabled');
      if (soundEnabled === 'false') {
        return false;
      }
    }
    return true; // Default to enabled
  };

  const [soundEnabled, setSoundEnabled] = useState(getInitialSoundState);
  const [mounted, setMounted] = useState(false);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    
    // If sound is being turned on, play a test sound
    if (newState) {
      playSound('enable');
    }
  };

  // Play sound effect
  const playSound = (action) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      
      if (action === 'enable') {
        audio.src = '/sounds/enable.mp3'; // Make sure to add this file to public/sounds/
      }
      
      audio.volume = 0.2; // Set volume to 20%
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Save sound preference to localStorage
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [soundEnabled, mounted]);

  // Don't render during SSR
  return null; // Always return null to hide the sound toggle button

  return (
    <motion.button
      onClick={toggleSound}
      className={`fixed top-36 right-4 z-50 p-2 rounded-full shadow-lg transition-all duration-300 ${
        soundEnabled ? 'bg-green-600' : 'bg-gray-500'
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
    >
      {soundEnabled ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.688l4.021-2.682a1 1 0 011.479.87v10.25a1 1 0 01-1.48.87l-4.02-2.683a1 1 0 01-.52-.878V9.567a1 1 0 01.52-.879z" 
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
            clipRule="evenodd" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
          />
        </svg>
      )}
    </motion.button>
  );
};

export default SoundToggle; 