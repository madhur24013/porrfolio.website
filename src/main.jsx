import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Loader from './components/Loader';

// Register service worker for offline capabilities
import { registerServiceWorker } from './utils/serviceWorkerRegistration';
registerServiceWorker();

// Set a maximum loading time
const MAX_LOADING_TIME = 10000; // 10 seconds

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Start loading
    const startTime = performance.now();
    
    // Function to render the app
    const renderApp = () => {
      const loadTime = performance.now() - startTime;
      console.log(`Application loaded in ${loadTime.toFixed(2)}ms`);
      setIsLoading(false);
    };

    // Set a timer to hide loading screen after 2 seconds
    const timer = setTimeout(() => {
      renderApp();
    }, 2000);

    // Set a maximum loading time
    const maxTimer = setTimeout(() => {
      if (isLoading) {
        console.warn('Maximum loading time reached, forcing render');
        renderApp();
      }
    }, MAX_LOADING_TIME);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      clearTimeout(maxTimer);
    };
  }, [isLoading]);

  return isLoading ? <Loader /> : <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);

// Create a function to measure and report performance metrics
const reportWebVitals = () => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      if ('performance' in window) {
        const performanceEntries = performance.getEntriesByType('navigation');
        if (performanceEntries.length > 0) {
          const timing = performanceEntries[0];
          console.log('Page load time:', timing.loadEventEnd - timing.startTime);
        }
      }
    });
  }
};

// Report performance metrics after rendering
reportWebVitals();
