import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Use placeholder images until actual achievement images are added
const achievementImages = {
  cyberPrism1: "https://placehold.co/600x400/2a2a2a/915eff?text=Cyber+Prism+1",
  cyberPrism2: "https://placehold.co/600x400/2a2a2a/915eff?text=Cyber+Prism+2",
  cyberPrism3: "https://placehold.co/600x400/2a2a2a/915eff?text=Cyber+Prism+3"
};

// Remove the localStorage clearing code to ensure data persistence
// Only initialize the storage on first load if needed
const initializeStorage = () => {
  const isInitialized = localStorage.getItem('achievements_initialized');
  if (!isInitialized) {
    localStorage.setItem('achievements_initialized', 'true');
    // No need to clear existing data
  }
};

// Execute the initialization
initializeStorage();

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    // Animate in
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, type: "spring", stiffness: 500, damping: 30 }
    });
    
    // Auto hide after 3 seconds
    const timer = setTimeout(() => {
      controls.start({
        y: 20,
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(onClose);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [controls, onClose]);
  
  const iconType = () => {
    if (message.includes('Like')) return '❤️';
    if (message.includes('Unlike')) return '💔';
    if (message.includes('Comment')) return '💬';
    return '✅';
  };
  
  return (
    <motion.div
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 rounded-xl shadow-2xl"
      initial={{ y: 20, opacity: 0 }}
      animate={controls}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-tertiary to-black-100 border border-highlight/30 backdrop-blur-sm rounded-xl">
        <div className="absolute inset-0 bg-highlight/5 rounded-xl"></div>
        <div className="px-6 py-3 flex items-center space-x-3">
          <div className="bg-highlight w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm">{iconType()}</span>
          </div>
          <div>
            <p className="text-white font-medium">{message.replace(/^(👍|👎|💬)\s/, '')}</p>
          </div>
          <button 
            onClick={onClose} 
            className="ml-2 text-white/70 hover:text-white transition-colors duration-200"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="h-1 bg-gradient-to-r from-highlight to-violet-600 animate-shrink"></div>
      </div>
    </motion.div>
  );
};

const ImageWithLoader = ({ src, alt, variants, className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-tertiary">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-highlight animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-tertiary">
          <p className="text-red-400 text-center">Failed to load image</p>
        </div>
      )}
      <motion.img
        src={src}
        alt={alt}
        className={className}
        variants={variants}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={{ opacity: loading ? 0 : 1 }}
      />
    </div>
  );
};

const CommentText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongComment = text.length > 100;

  return (
    <div>
      <p className="text-sm text-white">
        {expanded || !isLongComment ? text : text.substring(0, 100) + '...'}
      </p>
      {isLongComment && (
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-xs text-highlight mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-tertiary rounded-sm"
          aria-label={expanded ? "Show less text" : "Read more text"}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

// Function to play sound effects
const playSoundEffect = (action) => {
  if (typeof window !== 'undefined') {
    // Check if sound is enabled
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    if (!soundEnabled) return;

    const audio = new Audio();
    
    switch(action) {
      case 'like':
        audio.src = '/sounds/like.mp3';
        break;
      case 'unlike':
        audio.src = '/sounds/unlike.mp3';
        break;
      case 'comment':
        audio.src = '/sounds/comment.mp3';
        break;
      case 'expand':
        audio.src = '/sounds/expand.mp3';
        break;
      default:
        return;
    }
    
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
};

// Function to smoothly scroll to a section
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100, // Offset to account for navbar
      behavior: 'smooth'
    });
    playSoundEffect('expand');
  }
};

// Gamification component that shows user progress
const AchievementProgress = ({ onToggle }) => {
  // Get all achievement interaction data from localStorage
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Check if the achievements section is in view
  useEffect(() => {
    const checkVisibility = () => {
      const achievementsSection = document.getElementById('achievements');
      if (achievementsSection) {
        const rect = achievementsSection.getBoundingClientRect();
        const isInView = (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom >= 0
        );
        setIsVisible(isInView);
      }
    };
    
    // Initial check
    checkVisibility();
    
    // Listen for scroll events
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let likes = 0;
      let comments = 0;
      
      // Iterate through localStorage to count interactions
      Object.keys(localStorage).forEach(key => {
        if (key.includes('_liked') && localStorage.getItem(key) === 'true') {
          likes++;
        }
        if (key.includes('_comments')) {
          try {
            const commentsData = JSON.parse(localStorage.getItem(key));
            comments += commentsData.filter(c => c.author === "You").length;
          } catch (e) {
            console.error('Error parsing comments data:', e);
          }
        }
      });
      
      setTotalLikes(likes);
      setTotalComments(comments);
      
      // Calculate level based on total interactions
      const totalInteractions = likes + comments;
      const newLevel = Math.floor(totalInteractions / 3) + 1;
      setUserLevel(newLevel);
      
      // Calculate progress to next level (0-100%)
      const progress = ((totalInteractions % 3) / 3) * 100;
      setProgress(progress);
      
      // Default state based on stored preference or mobile viewport
      const storedState = localStorage.getItem('achievementPanelCollapsed');
      if (storedState !== null) {
        setIsCollapsed(storedState === 'true');
      } else {
        setIsCollapsed(window.innerWidth <= 768);
      }
    }
  }, []);
  
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('achievementPanelCollapsed', newState);
    
    // Call the onToggle callback to notify parent component
    if (onToggle) {
      onToggle(newState);
    }
    
    // Play sound if not collapsed
    if (!newState) {
      playSoundEffect('expand');
    }
  };
  
  // Determine position based on viewport
  const panelPosition = isMobile 
    ? "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50" 
    : "fixed bottom-4 left-4 z-50";
  
  // Determine width based on collapsed state and viewport
  const panelWidth = isCollapsed 
    ? "w-auto" 
    : isMobile 
      ? "w-[90%] max-w-[400px]" 
      : "w-[280px]";
  
  return (
    <>
      {/* Only show if the achievements section is in view */}
      {isVisible && (
        <>
          {/* Info button positioned outside and above the panel */}
          <div className={`fixed bottom-28 right-4 z-50`}>
            <motion.button
              className="w-12 h-12 bg-highlight rounded-full flex items-center justify-center shadow-xl border-2 border-highlight/30"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
                if (!showTooltip) playSoundEffect('expand');
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(145, 94, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              aria-label="Achievement system information"
            >
              <span className="text-white font-bold text-xl">i</span>
            </motion.button>
            
            {/* Tooltip positioned above the info button */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  className="absolute bottom-16 right-0 w-64 md:w-80 bg-tertiary border-2 border-highlight/40 p-5 rounded-xl shadow-2xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-white">
                    <h4 className="font-bold text-highlight text-sm mb-2">Achievement Hunter System</h4>
                    <p className="text-xs mb-2">Track your engagement and earn levels as you interact with my achievements!</p>
                    
                    <h5 className="font-semibold text-xs mt-3 mb-1">How to earn points:</h5>
                    <ul className="text-xs space-y-1 ml-4 list-disc">
                      <li>Like any achievement (+1 point)</li>
                      <li>Comment on achievements (+1 point)</li>
                      <li>Every 3 points earns you a new level</li>
                    </ul>
                    
                    <h5 className="font-semibold text-xs mt-3 mb-1">Level Benefits:</h5>
                    <ul className="text-xs space-y-1 ml-4 list-disc">
                      <li>Level 1: Beginner badge</li>
                      <li>Level 3: Enthusiast badge</li>
                      <li>Level 5: Achievement Expert badge</li>
                      <li>Level 10: Ultimate Supporter badge</li>
                    </ul>
                    
                    <div className="mt-3 pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400">Your progress is saved in your browser and will be maintained across visits.</p>
                    </div>
                  </div>
                  <button 
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => setShowTooltip(false)}
                    aria-label="Close information"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  {/* Triangle pointer pointing down to the button */}
                  <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-tertiary"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Main Achievement Hunter panel */}
          <motion.div 
            className={`${panelPosition} ${panelWidth} overflow-hidden rounded-xl shadow-xl border-2 border-highlight/30 backdrop-blur-sm`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="bg-gradient-to-r from-tertiary to-black-100 cursor-pointer relative"
              onClick={toggleCollapse}
              whileHover={{ backgroundColor: "var(--highlight)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand achievement progress" : "Collapse achievement progress"}
            >
              <div className="flex items-center px-4 py-3 relative">
                <div className="bg-highlight text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                  {userLevel}
                </div>
                <div className="flex-grow">
                  <h4 className="text-white font-medium text-sm">Achievement Hunter</h4>
                  {!isCollapsed && (
                    <p className="text-xs text-gray-300">Level {userLevel}</p>
                  )}
                </div>
                
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-highlight/20"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-tertiary to-black-100 backdrop-blur-sm px-4 pb-4"
                  >
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Progress to Level {userLevel + 1}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-highlight to-violet-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                      
                      <div className="flex justify-between mt-3 text-xs text-gray-400">
                        <motion.div 
                          className="flex items-center"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <svg className="w-4 h-4 text-pink-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                          <span>{totalLikes} likes</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <svg className="w-4 h-4 text-[#915eff] mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
                          </svg>
                          <span>{totalComments} comments</span>
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className="mt-3 pt-3 border-t border-gray-700 text-center"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <div className="text-xs text-gray-300 mb-1">Achievements</div>
                        <div className="flex justify-center gap-1 mt-1">
                          {Array.from({ length: Math.min(5, userLevel) }).map((_, idx) => (
                            <motion.div 
                              key={idx}
                              className="w-5 h-5 bg-highlight rounded-full flex items-center justify-center"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.7 + (idx * 0.1) }}
                              title={`Level ${idx + 1} Badge`}
                            >
                              <span className="text-white text-[10px]">{idx + 1}</span>
                            </motion.div>
                          ))}
                          {userLevel > 5 && (
                            <motion.div 
                              className="w-5 h-5 bg-highlight rounded-full flex items-center justify-center"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3, delay: 1.2 }}
                              title="More Badges"
                            >
                              <span className="text-white text-[10px]">+{userLevel - 5}</span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="mt-3 flex justify-center"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                      >
                        <button 
                          onClick={toggleCollapse}
                          className="text-xs text-highlight hover:text-purple-400 focus:outline-none"
                          aria-label="Collapse achievement panel"
                        >
                          Hide Panel
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
};

const AchievementCard = ({ index, id, title, description, image, likes: initialLikes, comments: initialComments }) => {
  // Refs for keyboard navigation
  const commentInputRef = useRef(null);
  const commentButtonRef = useRef(null);
  const likeButtonRef = useRef(null);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Check localStorage for persisted state
  const getPersistedLikeState = () => {
    const likeState = localStorage.getItem(`achievement_${id}_liked`);
    return likeState === 'true';
  };

  const getPersistedLikeCount = () => {
    const likeCount = localStorage.getItem(`achievement_${id}_likeCount`);
    return likeCount ? parseInt(likeCount) : initialLikes;
  };

  const getPersistedComments = () => {
    const savedComments = localStorage.getItem(`achievement_${id}_comments`);
    return savedComments ? JSON.parse(savedComments) : initialCommentsData;
  };

  // Initial comments data with Indian names and natural conversation
  const initialCommentsData = id === "cyber-prism-1" 
    ? [
        { 
          author: "Rajesh",
          text: "Bhai, this is amazing! I remember when we were preparing for this workshop. Your hard work really paid off!",
          timestamp: "6 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks yaar! Those late night practice sessions were worth it. Couldn't have done it without your help though!",
          timestamp: "6 days ago"
        },
        {
          author: "Khushi",
          text: "So proud of you Madhur bhai! 😊 You always inspire us juniors to do better. Can you share some tips for the next batch?",
          timestamp: "5 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thank you Khushi! Just stay consistent and practice daily. Teamwork is key in these competitions. Will definitely conduct a session for juniors soon!",
          timestamp: "5 days ago"
        },
        {
          author: "Vishwam",
          text: "Arre waah Madhur! True talent always shines. Our college is proud of you. Treat toh banta hai ab 😉",
          timestamp: "4 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Haha thanks Vishwam! Treat pakka, canteen mein coffee on me 😄",
          timestamp: "4 days ago"
        },
        {
          author: "Ashutosh",
          text: "Kya baat hai bhai! This is seriously impressive. What topics did they cover in the workshop?",
          timestamp: "3 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Ashu! They covered network security, ethical hacking, and cybersecurity frameworks. Really comprehensive stuff. I can share my notes if you want.",
          timestamp: "3 days ago" 
        },
        {
          author: "Atharva",
          text: "Massive achievement Madhur! Always knew you had the skills for this. We should collaborate on the college tech fest project.",
          timestamp: "2 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thank you Atharva! Definitely up for collaboration. Let's catch up next week and plan something cool for the tech fest.",
          timestamp: "2 days ago"
        }
      ]
    : id === "cyber-prism-2"
    ? [
        {
          author: "Ananya",
          text: "Well deserved achievement! The competition was tough but you nailed it. 👏",
          timestamp: "10 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thank you Ananya! Yes, the competition was challenging but enjoyed every bit of it!",
          timestamp: "10 days ago"
        },
        {
          author: "Vishwam",
          text: "Congrats Madhur! Your dedication to cybersecurity is inspiring. What was your favorite part of the workshop?",
          timestamp: "9 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Vishwam! The hands-on hacking simulation was my favorite - we got to test real-world vulnerabilities in a safe environment. Super cool experience!",
          timestamp: "9 days ago"
        },
        {
          author: "Khushi",
          text: "This is amazing! Does this certification help with placements? I'm thinking of pursuing cybersecurity too.",
          timestamp: "8 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "It definitely does, Khushi! Companies are actively looking for cybersecurity skills. Happy to guide you if you're interested in this field.",
          timestamp: "8 days ago"
        }
      ]
    : id === "cyber-prism-3"
    ? [
        {
          author: "Arjun",
          text: "Third place is still a great achievement! What was your project about?",
          timestamp: "12 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Arjun! My project was on IoT security vulnerabilities and a framework to protect smart home devices. Learned a lot building it!",
          timestamp: "12 days ago"
        },
        {
          author: "Neha",
          text: "Congratulations! I saw your presentation and it was brilliant. No wonder you got placed!",
          timestamp: "11 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thank you so much Neha! Really appreciate you coming to watch the presentation. Was super nervous but glad it went well!",
          timestamp: "11 days ago"
        },
        {
          author: "Ashutosh",
          text: "Bronze medal is awesome yaar! Who won first place? Their project must have been exceptional.",
          timestamp: "10 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Ashu! First place went to that team from Delhi with their blockchain security solution. Their implementation was next level, deserved winners!",
          timestamp: "10 days ago"
        },
        {
          author: "Atharva",
          text: "Third place in such a prestigious workshop is huge! Did you get any feedback from the judges on improvements?",
          timestamp: "9 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Yes Atharva, they suggested enhancing the authentication module and adding more test cases. Working on those improvements now for the next competition!",
          timestamp: "9 days ago"
        }
      ]
    : id === "python-course"
    ? [
        {
          author: "Rahul",
          text: "91.5% is excellent! Are you planning to learn Django or Flask next?",
          timestamp: "15 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Rahul! Yes, thinking of starting with Flask first for its simplicity, then moving to Django for more complex projects. What would you recommend?",
          timestamp: "15 days ago"
        },
        {
          author: "Meera",
          text: "I'm also taking this course right now. Any tips to score well?",
          timestamp: "14 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Hi Meera! Focus on the practice exercises and build small projects along the way. The final project is weighted heavily, so put extra effort there. All the best!",
          timestamp: "14 days ago"
        },
        {
          author: "Khushi",
          text: "Google certificates are so valuable these days! Is this your first programming language?",
          timestamp: "13 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "No, I started with Java in college, but Python quickly became my favorite for its versatility. Perfect for data science and automation which I'm focusing on.",
          timestamp: "13 days ago"
        },
        {
          author: "Vishwam",
          text: "91.5% wah wah! 🔥 Abhi toh Google job pakki! Any cool projects you built during the course?",
          timestamp: "12 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Haha, Google job ke liye abhi aur mehnat karni padegi! 😄 I built a data analyzer for cricket statistics which was fun. Will share the GitHub link soon.",
          timestamp: "12 days ago"
        }
      ]
    : id === "aws-cert"
    ? [
        {
          author: "Amit",
          text: "AWS certification is very valuable in today's job market. Are you planning for the Solutions Architect next?",
          timestamp: "7 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Yes Amit, Solutions Architect Associate is my next target. Need to gain some more hands-on experience with EC2 and Lambda first though.",
          timestamp: "7 days ago"
        },
        {
          author: "Deepika",
          text: "Congrats! I'm preparing for the same cert. How difficult was the exam?",
          timestamp: "6 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Deepika! The exam was moderately difficult - focus on IAM, networking, and security sections. Happy to share my study resources if you need them.",
          timestamp: "6 days ago"
        },
        {
          author: "Atharva",
          text: "Bhai, AWS skills will take you places! I've heard companies like Infosys and TCS specifically look for cloud certifications now.",
          timestamp: "5 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "You're right Atharva! Cloud computing is the future. I'm already seeing more opportunities opening up after adding this to my resume.",
          timestamp: "5 days ago"
        },
        {
          author: "Ashutosh",
          text: "Awesome achievement! How much time did it take you to prepare for this certification?",
          timestamp: "4 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Ashutosh! It took me about 2 months of dedicated studying. The practical labs were the most time-consuming but also the most useful part.",
          timestamp: "4 days ago"
        },
        {
          author: "Suresh",
          text: "This is fantastic! Cloud computing skills are in such high demand now.",
          timestamp: "3 days ago"
        },
        {
          author: "Madhur Haryan",
          text: "Thanks Suresh! Absolutely, the cloud market is booming. Planning to build a multi-cloud portfolio over time.",
          timestamp: "3 days ago"
        }
      ]
    : [];

  // State with persisted values
  const [likes, setLikes] = useState(getPersistedLikeCount());
  const [liked, setLiked] = useState(getPersistedLikeState());
  const [comments, setComments] = useState(getPersistedComments());
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(3); // Initially show 3 comments
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(`achievement_${id}_liked`, liked);
    localStorage.setItem(`achievement_${id}_likeCount`, likes);
    localStorage.setItem(`achievement_${id}_comments`, JSON.stringify(comments));
  }, [id, liked, likes, comments]);

  // Handle focus when comments are shown or hidden
  useEffect(() => {
    if (showComments && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showComments]);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
      showToast('Unlike saved', 'success');
      playSoundEffect('unlike');
    } else {
      setLikes(likes + 1);
      setLiked(true);
      showToast('Like saved', 'success');
      playSoundEffect('like');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsSubmitting(true);
      // Simulate network delay
      setTimeout(() => {
        const newCommentObj = {
          author: "You",
          text: newComment,
          timestamp: "Just now"
        };
        setComments([...comments, newCommentObj]);
        setNewComment("");
        setIsSubmitting(false);
        // Show all comments when a new one is added
        setCommentsVisible(comments.length + 1);
        showToast('Comment posted successfully', 'success');
        playSoundEffect('comment');
      }, 500);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const showMoreComments = () => {
    setCommentsVisible(commentsVisible + 5);
    playSoundEffect('expand');
  };

  const showLessComments = () => {
    setCommentsVisible(3);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const visibleComments = comments.slice(0, commentsVisible);
  const hasMoreComments = comments.length > commentsVisible;
  const hasLessComments = commentsVisible > 3 && comments.length > 3;

  // Animation variants for cards
  const cardVariants = {
    hidden: {},
    visible: {},
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Animation for image
  const imageVariants = {
    hover: {
      scale: 1.05,
      filter: "brightness(1.1)",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      <motion.div
        variants={{
          ...fadeIn("up", "spring", index * 0.5, 0.75),
          ...cardVariants
        }}
        className="bg-tertiary p-5 rounded-2xl w-full sm:w-[360px] md:w-[360px] lg:w-[360px] xl:w-[380px]"
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative w-full h-[230px] overflow-hidden rounded-2xl">
          <ImageWithLoader
            src={image || achievementImages[id.replace('-', '')]}
            alt={title}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300`}></div>
        </div>

        <div className="mt-5">
          <motion.h3 
            className="text-white font-bold text-[24px] sm:text-[20px] md:text-[22px] lg:text-[24px]"
            animate={isHovered ? { color: "#915eff" } : { color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <motion.div 
            className={`text-white-100 flex items-center cursor-pointer transition-all duration-300 hover:scale-110 ${liked ? 'text-pink-500' : 'hover:text-pink-300'}`}
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            role="button"
            tabIndex={0}
            aria-label={liked ? "Unlike this achievement" : "Like this achievement"}
            aria-pressed={liked}
            onKeyDown={(e) => handleKeyDown(e, handleLike)}
            ref={likeButtonRef}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${liked ? 'text-pink-500' : 'text-[#915eff]'} transition-colors duration-300`}
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="ml-2">{likes}</span>
          </motion.div>
          
          <motion.div 
            className="text-white-100 flex items-center ml-4 cursor-pointer transition-all duration-300 hover:text-[#915eff] hover:scale-110"
            onClick={() => setShowComments(!showComments)}
            whileTap={{ scale: 0.9 }}
            role="button"
            tabIndex={0}
            aria-label={showComments ? "Hide comments" : "Show comments"}
            aria-expanded={showComments}
            onKeyDown={(e) => handleKeyDown(e, () => setShowComments(!showComments))}
            ref={commentButtonRef}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-[#915eff]" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="ml-2">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {showComments && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 max-h-[300px] overflow-y-auto bg-tertiary rounded-md p-3 scrollbar-thin scrollbar-thumb-highlight scrollbar-track-black-200">
                {comments.length > 0 ? (
                  <>
                    {visibleComments.map((comment, idx) => (
                      <motion.div 
                        key={idx} 
                        className={`mb-3 pb-3 border-b border-gray-700 last:border-b-0 ${comment.author === "Madhur Haryan" || comment.author === "You" ? "pl-2 border-l-2 border-l-[#915eff]" : ""}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-semibold ${comment.author === "Madhur Haryan" || comment.author === "You" ? "text-[#915eff]" : "text-[#f06292]"}`}>
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-400">{comment.timestamp}</span>
                        </div>
                        <CommentText text={comment.text} />
                      </motion.div>
                    ))}
                    
                    <div className="flex justify-center mt-2 space-x-4">
                      {hasMoreComments && (
                        <motion.button 
                          onClick={showMoreComments} 
                          className="text-sm text-[#915eff] hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#1d1836] rounded-sm px-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Show ${Math.min(5, comments.length - commentsVisible)} more comments`}
                        >
                          Show more comments
                        </motion.button>
                      )}
                      
                      {hasLessComments && (
                        <motion.button 
                          onClick={showLessComments} 
                          className="text-sm text-[#915eff] hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#1d1836] rounded-sm px-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Show fewer comments"
                        >
                          Show less
                        </motion.button>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center text-sm">No comments yet. Be the first to comment!</p>
                )}
              </div>
              
              <form onSubmit={handleAddComment} className="flex flex-col">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-tertiary text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-highlight"
                  ref={commentInputRef}
                  aria-label="Add a comment"
                  disabled={isSubmitting}
                />
                <motion.button 
                  type="submit" 
                  className={`mt-2 bg-highlight hover:bg-violet-700 text-white rounded-md py-1 px-3 transition-colors duration-300 self-end disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? 'relative' : ''}`}
                  whileHover={{ scale: 1.05, backgroundColor: "#7d51d6" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting || !newComment.trim()}
                  aria-label={isSubmitting ? "Posting comment..." : "Post comment"}
                >
                  {isSubmitting ? (
                    <>
                      <span className="opacity-0">Post</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    "Post"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const Achievements = () => {
  // State to track if achievement panel is collapsed
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(
    localStorage.getItem('achievementPanelCollapsed') === 'true'
  );
  
  // State to track if the section is in view
  const [isSectionInView, setIsSectionInView] = useState(false);
  
  // Listen for changes to panel collapsed state
  useEffect(() => {
    const handleStorageChange = () => {
      const isCollapsed = localStorage.getItem('achievementPanelCollapsed') === 'true';
      setIsPanelCollapsed(isCollapsed);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for internal state changes
    const handlePanelToggle = (e) => {
      setIsPanelCollapsed(e.detail.isCollapsed);
    };
    
    window.addEventListener('achievement-panel-toggle', handlePanelToggle);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('achievement-panel-toggle', handlePanelToggle);
    };
  }, []);
  
  // Check if the achievements section is in view
  useEffect(() => {
    const checkVisibility = () => {
      const achievementsSection = document.getElementById('achievements');
      if (achievementsSection) {
        const rect = achievementsSection.getBoundingClientRect();
        const isInView = (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom >= 0
        );
        setIsSectionInView(isInView);
      }
    };
    
    // Initial check
    checkVisibility();
    
    // Listen for scroll events
    window.addEventListener('scroll', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);
  
  const achievements = [
    {
      id: "cyber-prism-1",
      title: "🌟 Proud to Share My Achievement at Cyber Prism 🌟",
      description: "Received a certificate for outstanding performance at the Cyber Prism Workshop.",
      image: achievementImages.cyberPrism1,
      likes: 12,
      comments: null
    },
    {
      id: "cyber-prism-2",
      title: "Excited to Announce My Achievement",
      description: "Successfully completed the Cyber Prism Workshop and received certification.",
      image: achievementImages.cyberPrism2,
      likes: 5,
      comments: "1 comment"
    },
    {
      id: "cyber-prism-3",
      title: "Secured 3rd Place in Cyber Prism Workshop",
      description: "Honored to have achieved third place in this competitive event.",
      image: achievementImages.cyberPrism3,
      likes: 5,
      comments: null
    },
    {
      id: "python-course",
      title: "GOOGLE'S CRASH COURSE ON PYTHON",
      description: "Successfully completed a 32-hour Python course on Coursera with a 91.50% grade. Excited to apply my skills in real-world projects!",
      image: achievementImages.pythonCourse,
      likes: 6,
      comments: null
    },
    {
      id: "aws-cert",
      title: "AWS Cloud Technical Essentials",
      description: "Earned the AWS Cloud Technical Essentials certificate from Coursera, covering IAM, AWS networking, cloud computing, and security.",
      image: achievementImages.awsCert,
      likes: 8,
      comments: null
    }
  ];

  // Split achievements into two rows: first 3, then 2
  const firstRowAchievements = achievements.slice(0, 3);
  const secondRowAchievements = achievements.slice(3);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I've accomplished</p>
        <h2 className={styles.sectionHeadText}>Featured Achievements.</h2>
      </motion.div>

      <div className="mt-20">
        {/* First row with 3 achievements */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.2 }}
        >
          {firstRowAchievements.map((achievement, index) => (
            <AchievementCard 
              key={`achievement-${index}`}
              index={index}
              {...achievement}
            />
          ))}
        </motion.div>

        {/* Second row with 2 achievements centered */}
        <motion.div 
          className="flex justify-center gap-16 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.2, delay: 0.3 }}
        >
          {secondRowAchievements.map((achievement, index) => (
            <AchievementCard 
              key={`achievement-${index + 3}`}
              index={index + 3}
              {...achievement}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Only show Gamification UI when the section is in view */}
      {isSectionInView && (
        <AchievementProgress onToggle={(isCollapsed) => {
          setIsPanelCollapsed(isCollapsed);
          // Dispatch custom event for other components to listen to
          window.dispatchEvent(new CustomEvent('achievement-panel-toggle', {
            detail: { isCollapsed }
          }));
        }} />
      )}
    </>
  );
};

export default SectionWrapper(Achievements, "achievements"); 