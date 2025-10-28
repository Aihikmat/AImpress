// Enhanced Navigation Module
class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        if (this.hamburger && this.navMenu) {
            this.setupHamburgerMenu();
            this.setupNavLinks();
            this.setupKeyboardNavigation();
            this.setupBodyScrollLock();
            this.setupResizeHandler();
            this.setupBackdropClick();
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background change on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            });
        }

        // Active section highlighting in navigation
        this.setupActiveSectionHighlighting();
    }

    setupHamburgerMenu() {
        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Add ARIA attributes for accessibility
        this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navMenu.setAttribute('aria-hidden', 'true');
    }

    setupNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }

    setupKeyboardNavigation() {
        // ESC key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
                this.hamburger.focus();
            }
        });

        // Tab navigation within menu
        this.navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isMenuOpen) {
                const focusableElements = this.navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    setupBodyScrollLock() {
        // Prevent body scroll when menu is open
        this.originalBodyStyle = document.body.style.overflow;
    }

    setupResizeHandler() {
        // Close menu on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    setupBackdropClick() {
        // Close menu when clicking outside
        this.navMenu.addEventListener('click', (e) => {
            if (e.target === this.navMenu) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.navMenu.setAttribute('aria-hidden', 'false');
        
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item
        const firstLink = this.navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navMenu.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = this.originalBodyStyle;
    }

    setupActiveSectionHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        function highlightActiveSection() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', highlightActiveSection);
    }
}

// Make Navigation globally available
window.Navigation = Navigation;

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    new Navigation();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        new Navigation();
    });
}