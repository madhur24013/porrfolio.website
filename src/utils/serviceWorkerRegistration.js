/**
 * Register service worker for offline capabilities and caching
 */
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
};

/**
 * Check if there are service worker updates available
 */
export const checkForUpdates = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.update();
      })
      .catch(error => {
        console.error('Error during service worker update:', error);
      });
  }
};

/**
 * Listen for service worker updates and notify the user
 * @param {Function} onUpdateFound - Callback when update is found
 */
export const listenForUpdates = (onUpdateFound) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && 
                navigator.serviceWorker.controller) {
              // New content is available; call the callback
              if (typeof onUpdateFound === 'function') {
                onUpdateFound();
              }
            }
          });
        });
      });
  }
}; 