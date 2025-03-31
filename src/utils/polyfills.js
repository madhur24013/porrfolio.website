/**
 * Polyfills for older browsers
 * This file provides necessary polyfills for features used in the application
 * that might not be supported in older browsers
 */

/**
 * IntersectionObserver polyfill
 * Adds support for browsers that don't have IntersectionObserver
 */
export const loadIntersectionObserverPolyfill = () => {
  if (!('IntersectionObserver' in window)) {
    import('intersection-observer').then(() => {
      console.log('IntersectionObserver polyfill loaded');
    });
  }
};

/**
 * RequestIdleCallback polyfill
 * Adds support for browsers that don't have requestIdleCallback
 */
export const loadRequestIdleCallbackPolyfill = () => {
  window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    const start = Date.now();
    return setTimeout(function() {
      cb({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

  window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    clearTimeout(id);
  };
};

/**
 * WebP detection
 * Checks if browser supports WebP image format
 */
export const checkWebpSupport = () => {
  const webpSupported = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  // Add class to document for CSS targeting
  if (webpSupported) {
    document.documentElement.classList.add('webp');
  } else {
    document.documentElement.classList.add('no-webp');
  }
  
  return webpSupported;
};

/**
 * Load all polyfills
 */
export const loadAllPolyfills = () => {
  loadIntersectionObserverPolyfill();
  loadRequestIdleCallbackPolyfill();
  checkWebpSupport();
}; 