/**
 * ============================================
 * MOJIK AI - Main JavaScript
 * Handles interactions and animations
 * ============================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ============================================
    // DOM ELEMENT REFERENCES
    // Cache frequently accessed elements
    // ============================================
    
    const elements = {
        header: document.getElementById('header'),
        backToTop: document.getElementById('backToTop'),
        modal: document.getElementById('waitlistModal'),
        modalOverlay: document.querySelector('.modal__overlay'),
        modalClose: document.querySelector('.modal__close'),
        waitlistForm: document.getElementById('waitlistForm'),
        modalTriggers: document.querySelectorAll('[data-modal="waitlist"]'),
        bannerLetters: document.querySelectorAll('.banner__letter')
    };
    
    // ============================================
    // CONFIGURATION
    // Adjustable settings for behaviors
    // ============================================
    
    const config = {
        scrollThreshold: 100,        // Pixels to scroll before header changes
        animationDelay: 100,         // Delay between staggered animations (ms)
        intersectionThreshold: 0.2   // Visibility threshold for animations
    };
    
    // ============================================
    // HEADER SCROLL BEHAVIOR
    // Adds background to header on scroll
    // ============================================
    
    /**
     * Handles header appearance based on scroll position
     * Adds 'header--scrolled' class when user scrolls past threshold
     */
    function handleHeaderScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > config.scrollThreshold) {
            elements.header.classList.add('header--scrolled');
        } else {
            elements.header.classList.remove('header--scrolled');
        }
    }
    
    // ============================================
    // BACK TO TOP BUTTON
    // Shows/hides button based on scroll position
    // ============================================
    
    /**
     * Toggles visibility of back-to-top button
     * Shows button after scrolling past threshold
     */
    function handleBackToTopVisibility() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > config.scrollThreshold * 3) {
            elements.backToTop.classList.add('footer__back-to-top--visible');
        } else {
            elements.backToTop.classList.remove('footer__back-to-top--visible');
        }
    }
    
    /**
     * Smoothly scrolls page to top
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // ============================================
    // MODAL FUNCTIONALITY
    // Handles waitlist modal open/close
    // ============================================
    
    /**
     * Opens the waitlist modal
     * Prevents body scroll when modal is open
     */
    function openModal() {
        elements.modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input for accessibility
        const firstInput = elements.modal.querySelector('.modal__input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
    
    /**
     * Closes the waitlist modal
     * Restores body scroll
     */
    function closeModal() {
        elements.modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }
    
    /**
     * Handles form submission
     * @param {Event} event - Form submit event
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        const name = event.target.querySelector('input[type="text"]').value;
        const email = event.target.querySelector('input[type="email"]').value;
        
        // Simple validation
        if (!name || !email) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        console.log('Form submitted:', { name, email });
        
        // Show success message
        showNotification('Welcome to the Mojik family! 🎉', 'success');
        
        // Reset form and close modal
        event.target.reset();
        setTimeout(closeModal, 1500);
    }
    
    // ============================================
    // NOTIFICATION SYSTEM
    // Displays temporary messages to user
    // ============================================
    
    /**
     * Shows a notification message
     * @param {string} message - Message to display
     * @param {string} type - Type of notification ('success' or 'error')
     */
    function showNotification(message, type = 'success') {
        // Remove existing notification if present
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="notification__message">${message}</span>
        `;
        
        // Add styles inline (or add to CSS)
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background: ${type === 'success' ? '#4cd137' : '#ff6b6b'};
            color: white;
            border-radius: 10px;
            font-weight: 600;
            z-index: 2000;
            animation: slideDown 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        `;
        
        // Add animation keyframes
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // INTERSECTION OBSERVER
    // Animates elements when they come into view
    // ============================================
    
    /**
     * Sets up intersection observer for scroll animations
     */
    function setupScrollAnimations() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            return;
        }
        
        // Elements to animate
        const animatedElements = document.querySelectorAll(
            '.app-features__item, .cta-section__card, .footer__container > *'
        );
        
        // Create observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Add staggered animation delay
                        entry.target.style.animationDelay = `${index * config.animationDelay}ms`;
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: config.intersectionThreshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Add initial styles and observe elements
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
        
        // Add animation class styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // Handles smooth scrolling to page sections
    // ============================================
    
    /**
     * Sets up smooth scrolling for anchor links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(event) {
                const targetId = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    event.preventDefault();
                    
                    const headerHeight = elements.header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ============================================
    // KEYBOARD NAVIGATION
    // Handles keyboard accessibility
    // ============================================
    
    /**
     * Handles keyboard events for modal
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeyboard(event) {
        // Close modal on Escape key
        if (event.key === 'Escape' && elements.modal.classList.contains('modal--active')) {
            closeModal();
        }
    }
    
    // ============================================
    // PARALLAX EFFECT (Optional Enhancement)
    // Subtle parallax for hero section
    // ============================================
    
    /**
     * Applies subtle parallax effect to hero
     */
    function handleParallax() {
        const scrollY = window.scrollY || window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrollY < window.innerHeight) {
            const speed = 0.5;
            hero.style.backgroundPositionY = `${scrollY * speed}px`;
        }
    }
    
    // ============================================
    // TYPING EFFECT FOR BANNER (Optional)
    // Animates the imagination text
    // ============================================
    
    /**
     * Adds hover effect to banner letters
     */
    function setupBannerInteraction() {
        elements.bannerLetters.forEach(letter => {
            letter.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.3) rotate(-10deg)';
            });
            
            letter.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    // ============================================
    // EVENT LISTENERS
    // Attach all event listeners
    // ============================================
    
    function initEventListeners() {
        // Scroll events (throttled for performance)
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleHeaderScroll();
                    handleBackToTopVisibility();
                    handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Back to top button click
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', scrollToTop);
        }
        
        // Modal triggers
        elements.modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', openModal);
        });
        
        // Modal close button
        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', closeModal);
        }
        
        // Modal overlay click to close
        if (elements.modalOverlay) {
            elements.modalOverlay.addEventListener('click', closeModal);
        }
        
        // Form submission
        if (elements.waitlistForm) {
            elements.waitlistForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Keyboard events
        document.addEventListener('keydown', handleKeyboard);
    }
    
    // ============================================
    // INITIALIZATION
    // Start all functionality
    // ============================================
    
    function init() {
        // Initialize event listeners
        initEventListeners();
        
        // Setup animations
        setupScrollAnimations();
        
        // Setup smooth scroll
        setupSmoothScroll();
        
        // Setup banner interaction
        setupBannerInteraction();
        
        // Initial calls
        handleHeaderScroll();
        handleBackToTopVisibility();
        
        // Log initialization
        console.log('🎉 Mojik AI website initialized successfully!');
    }
    
    // Start the application
    init();
});

/**
 * ============================================
 * PERFORMANCE OPTIMIZATION
 * Debounce and throttle utilities
 * ============================================
 */

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}