/**
 * WebP Detection and Fallback Script
 * Provides client-side WebP support detection and fallback mechanisms
 */

(function() {
    'use strict';
    
    // Check if browser supports WebP
    function supportsWebP() {
        return new Promise((resolve) => {
            const webp = new Image();
            webp.onload = webp.onerror = () => {
                resolve(webp.height === 2);
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    // Add WebP support class to body
    function addWebPClass() {
        supportsWebP().then((supported) => {
            document.body.classList.add(supported ? 'webp-supported' : 'no-webp');
            
            // If WebP is not supported, convert any WebP images to fallback
            if (!supported) {
                convertWebPImages();
            }
        });
    }
    
    // Convert WebP images to fallback formats
    function convertWebPImages() {
        const webpImages = document.querySelectorAll('img[src*=".webp"], img[data-src*=".webp"]');
        
        webpImages.forEach(img => {
            const webpSrc = img.src || img.dataset.src;
            if (webpSrc && webpSrc.includes('.webp')) {
                // Try to find original image by replacing .webp with common extensions
                const fallbackExtensions = ['.jpg', '.jpeg', '.png'];
                const basePath = webpSrc.replace('.webp', '');
                
                // Try each fallback extension
                let fallbackFound = false;
                fallbackExtensions.forEach(ext => {
                    if (!fallbackFound) {
                        const fallbackSrc = basePath + ext;
                        
                        // Check if fallback image exists
                        const testImg = new Image();
                        testImg.onload = () => {
                            if (!fallbackFound) {
                                fallbackFound = true;
                                if (img.dataset.src) {
                                    img.dataset.src = fallbackSrc;
                                } else {
                                    img.src = fallbackSrc;
                                }
                            }
                        };
                        testImg.src = fallbackSrc;
                    }
                });
            }
        });
    }
    
    // Enhanced lazy loading with WebP support
    function enhanceLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addWebPClass();
            enhanceLazyLoading();
        });
    } else {
        addWebPClass();
        enhanceLazyLoading();
    }
    
    // Re-check for new images added dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const newImages = mutation.target.querySelectorAll('img[data-src]');
                if (newImages.length > 0) {
                    enhanceLazyLoading();
                }
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();