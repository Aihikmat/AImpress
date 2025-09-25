// Animations Module
class Animations {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.heroElements = document.querySelectorAll('.floating-elements .element');
        this.statsSection = document.querySelector('.stats');
        this.statNumbers = document.querySelectorAll('.stat h3');
        this.hasAnimated = false;
        this.canvas = null;
        this.particles = [];
        this.init();
    }

    init() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (this.hero) {
                this.hero.style.transform = `translateY(${rate}px)`;
            }
            
            // Animate floating elements
            this.heroElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
        
        // Typing animation for hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    heroTitle.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing animation after a short delay
            setTimeout(typeWriter, 1000);
        }
        
        // Intersection Observer for stats animation
        if (this.statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounters();
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(this.statsSection);
        }
        
        // Hover effects for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
                this.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.25)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
        
        // Interactive background particles
        this.createParticleBackground();
        
        // Smooth reveal animations for sections
        const revealElements = document.querySelectorAll('.service-card, .workshop-card, .about-text, .appointment-info');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.1 });
        
        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            revealObserver.observe(element);
        });
        
        // Tech stack animation
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) rotate(5deg) scale(1.1)';
                this.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.3)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotate(0deg) scale(1)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });
        
        // Workshop card tilt effect
        const workshopCards = document.querySelectorAll('.workshop-card');
        workshopCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
        
        // Add notification styles dynamically
        this.addNotificationStyles();
    }

    animateCounters() {
        if (this.hasAnimated) return;
        this.hasAnimated = true;
        
        this.statNumbers.forEach(stat => {
            const finalNumber = parseInt(stat.textContent.replace(/\D/g, ''));
            const suffix = stat.textContent.replace(/\d/g, '');
            let currentNumber = 0;
            const increment = finalNumber / 50;
            
            const counter = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    stat.textContent = finalNumber + suffix;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(currentNumber) + suffix;
                }
            }, 30);
        });
    }

    createParticleBackground() {
        if (!this.hero) return;
        
        this.canvas = document.createElement('canvas');
        const ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.1';
        this.hero.appendChild(this.canvas);
        
        this.particles = [];
        const particleCount = 50;
        const heroElement = this.hero; // Store reference for use in functions
        
        const resizeCanvas = () => {
            if (this.canvas && heroElement) {
                this.canvas.width = heroElement.offsetWidth;
                this.canvas.height = heroElement.offsetHeight;
            }
        };
        
        const createParticles = () => {
            this.particles = [];
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1
                });
            }
        };
        
        const animateParticles = () => {
            if (!this.canvas) return;
            
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = '#ffffff';
            
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        resizeCanvas();
        createParticles();
        animateParticles();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }

    addNotificationStyles() {
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transform: translateX(400px);
                transition: all 0.3s ease;
                z-index: 10000;
                border-left: 4px solid #667eea;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification i {
                color: #667eea;
            }
            
            .notification-success i {
                color: #10b981;
            }
            
            .notification-error i {
                color: #ef4444;
            }
        `;

        // Add styles to head
        const styleSheet = document.createElement('style');
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
}

// Make Animations globally available
window.Animations = Animations;

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    new Animations();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        new Animations();
    });
}