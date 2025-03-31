// Image optimization utility functions
import { useState, useEffect } from 'react';

/**
 * Progressive image loading hook
 * @param {string} src - Image source URL
 * @param {string} placeholderSrc - Optional placeholder image
 * @returns {Object} - Image source and loading state
 */
export const useProgressiveImg = (src, placeholderSrc) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || '');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create new image object to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    
    return () => {
      // Clean up
      img.onload = null;
    };
  }, [src]);

  return { imgSrc, isLoaded };
};

/**
 * Function to create a low-quality placeholder for images
 * @param {string} src - Original image source
 * @param {number} width - Width of placeholder
 * @returns {string} - Blurred base64 placeholder
 */
export const createPlaceholder = (src, width = 20) => {
  // Simple data URI placeholder with transparent pixel
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${width}' viewBox='0 0 ${width} ${width}'%3E%3C/svg%3E`;
};

/**
 * Determines if the browser supports WebP image format
 * @returns {boolean} - Whether WebP is supported
 */
export const supportsWebP = () => {
  // Check for WebP support
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  // WebP not supported
  return false;
};

/**
 * Optimizes image path based on browser capabilities
 * @param {string} imagePath - Original image path
 * @returns {string} - Optimized image path
 */
export const getOptimizedImagePath = (imagePath) => {
  if (!imagePath) return imagePath;
  
  // Check if already using optimized format
  if (imagePath.includes('webp') || imagePath.includes('avif')) {
    return imagePath;
  }
  
  // Check for WebP support
  if (supportsWebP() && !imagePath.startsWith('http')) {
    // Replace extension with webp if local file
    return imagePath.replace(/\.(jpe?g|png)$/i, '.webp');
  }
  
  return imagePath;
}; 