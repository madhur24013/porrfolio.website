import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  // Check if user has a theme preference in localStorage or prefers dark mode
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (typeof storedTheme === 'string') {
        return storedTheme;
      }

      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return 'dark';
      }
    }
    return 'dark'; // Default to dark mode for this site
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    playSound('toggle');
  };

  // Play sound effect when toggling theme
  const playSound = (action) => {
    if (typeof window !== 'undefined') {
      // Check if sound is enabled (default is true)
      const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
      if (!soundEnabled) return;

      const audio = new Audio();
      
      // Set different sounds for different actions
      if (action === 'toggle') {
        audio.src = '/sounds/switch.mp3'; // Make sure to add this file to public/sounds/
      }
      
      audio.volume = 0.2; // Set volume to 20%
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Apply theme to document when theme changes
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    
    const root = window.document.documentElement;
    
    // Remove old theme class
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    // Add new theme class
    root.classList.add(theme);
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Don't render during SSR
  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed top-24 right-4 z-50 p-2 rounded-full shadow-lg transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#915eff]' : 'bg-orange-400'
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </motion.button>
  );
};

export default ThemeToggle; 