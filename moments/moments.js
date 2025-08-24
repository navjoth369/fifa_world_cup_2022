class ImageGallery {
    constructor() {
        this.galleryItems = [];
        this.currentIndex = 0;
        this.lightbox = null;
        this.lightboxImage = null;
        this.lightboxCaption = null;
        this.isLightboxOpen = false;
        
        this.init();
    }
    //lightbox-image

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGallery());
        } else {
            this.setupGallery();
        }
    }

    setupGallery() {
        // Get DOM elements
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.lightboxOverlay = document.getElementById('lightboxOverlay');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
        
        // Get all gallery items
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup touch/swipe support for mobile
        this.setupTouchSupport();
        
        // Preload images for better performance
        this.preloadImages();
    }

    setupEventListeners() {
        // Gallery item clicks
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(index);
            });
            
            // Add keyboard support for gallery items
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(index);
                }
            });
        });

        // Lightbox controls
        this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        this.lightboxPrev.addEventListener('click', () => this.navigatePrev());
        this.lightboxNext.addEventListener('click', () => this.navigateNext());
        this.lightboxOverlay.addEventListener('click', () => this.closeLightbox());
        
        // Prevent lightbox content clicks from closing the lightbox
        document.querySelector('.lightbox-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isLightboxOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigatePrev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateNext();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToIndex(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToIndex(this.galleryItems.length - 1);
                    break;
            }
        });
    }

    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        this.lightbox.addEventListener('touchstart', (e) => {
            if (!this.isLightboxOpen) return;
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        this.lightbox.addEventListener('touchend', (e) => {
            if (!this.isLightboxOpen) return;
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;
            
            // Only process horizontal swipes (ignore vertical scrolling)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.navigatePrev();
                } else {
                    this.navigateNext();
                }
            }
        }, { passive: true });
    }

    preloadImages() {
        // Preload the first few high-res images for better performance
        const preloadCount = Math.min(5, this.galleryItems.length);
        for (let i = 0; i < preloadCount; i++) {
            const img = new Image();
            img.src = this.galleryItems[i].dataset.image;
        }
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.isLightboxOpen = true;
        
        // Update lightbox content
        this.updateLightboxContent();
        
        // Show lightbox
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        this.lightboxClose.focus();
        
        // Preload adjacent images
        this.preloadAdjacentImages();
        
        // Track analytics if needed
        this.trackImageView(index);
    }

    closeLightbox() {
        this.isLightboxOpen = false;
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the gallery item that was clicked
        if (this.galleryItems[this.currentIndex]) {
            this.galleryItems[this.currentIndex].focus();
        }
    }

    navigatePrev() {
        this.currentIndex = this.currentIndex > 0 ? 
            this.currentIndex - 1 : 
            this.galleryItems.length - 1;
        
        this.updateLightboxContent();
        this.preloadAdjacentImages();
    }

    navigateNext() {
        this.currentIndex = this.currentIndex < this.galleryItems.length - 1 ? 
            this.currentIndex + 1 : 
            0;
        
        this.updateLightboxContent();
        this.preloadAdjacentImages();
    }

    navigateToIndex(index) {
        if (index >= 0 && index < this.galleryItems.length) {
            this.currentIndex = index;
            this.updateLightboxContent();
            this.preloadAdjacentImages();
        }
    }

    updateLightboxContent() {
        const currentItem = this.galleryItems[this.currentIndex];
        const imageSrc = currentItem.dataset.image;
        const caption = currentItem.dataset.caption;
        
        // Add loading class
        this.lightboxImage.classList.add('loading');
        
        // Create new image element to handle loading
        const newImage = new Image();
        newImage.onload = () => {
            this.lightboxImage.src = imageSrc;
            this.lightboxImage.alt = currentItem.querySelector('img').alt;
            this.lightboxCaption.textContent = caption;
            this.lightboxImage.classList.remove('loading');
        };
        
        newImage.onerror = () => {
            console.error('Failed to load image:', imageSrc);
            this.lightboxImage.classList.remove('loading');
            this.lightboxCaption.textContent = 'Failed to load image';
        };
        
        newImage.src = imageSrc;
        
        // Update navigation button states
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        // Update button visibility based on current position
        const isFirst = this.currentIndex === 0;
        const isLast = this.currentIndex === this.galleryItems.length - 1;
        
        // Always show buttons but you could hide them if desired
        this.lightboxPrev.style.opacity = isFirst && this.galleryItems.length > 1 ? '0.5' : '1';
        this.lightboxNext.style.opacity = isLast && this.galleryItems.length > 1 ? '0.5' : '1';
        
        // Update aria-labels for better accessibility
        this.lightboxPrev.setAttribute('aria-label', 
            `Previous image (${this.currentIndex + 1} of ${this.galleryItems.length})`);
        this.lightboxNext.setAttribute('aria-label', 
            `Next image (${this.currentIndex + 1} of ${this.galleryItems.length})`);
    }

    preloadAdjacentImages() {
        // Preload previous and next images for smoother navigation
        const prevIndex = this.currentIndex > 0 ? 
            this.currentIndex - 1 : 
            this.galleryItems.length - 1;
        const nextIndex = this.currentIndex < this.galleryItems.length - 1 ? 
            this.currentIndex + 1 : 
            0;
        
        [prevIndex, nextIndex].forEach(index => {
            if (index !== this.currentIndex) {
                const img = new Image();
                img.src = this.galleryItems[index].dataset.image;
            }
        });
    }

    trackImageView(index) {
        // Optional: Add analytics tracking here
        console.log(`Viewing image ${index + 1} of ${this.galleryItems.length}`);
    }
}

// Utility functions for smooth scrolling and animations
class Utils {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'flex';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = progress;
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = '1';
            }
        }
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = startOpacity * (1 - progress);
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = '0';
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Enhanced lazy loading for images
class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    observeImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => this.imageObserver.observe(img));
    }

    loadImage(img) {
        img.classList.add('loading');
        
        img.addEventListener('load', () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        }, { once: true });

        img.addEventListener('error', () => {
            img.classList.remove('loading');
            img.classList.add('error');
            console.error('Failed to load image:', img.src);
        }, { once: true });
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => this.loadImage(img));
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.measurePageLoad();
        });

        // Monitor largest contentful paint
        if ('PerformanceObserver' in window) {
            this.observeLCP();
            this.observeCLS();
        }
    }

    measurePageLoad() {
        const navigation = performance.getEntriesByType('navigation')[0];
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        console.log('Page Performance:', this.metrics);
    }

    observeLCP() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    observeCLS() {
        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }
}

// Initialize the gallery when the script loads
const gallery = new ImageGallery();
const lazyLoader = new LazyLoader();
const performanceMonitor = new PerformanceMonitor();

// Export classes for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImageGallery, Utils, LazyLoader, PerformanceMonitor };
}
