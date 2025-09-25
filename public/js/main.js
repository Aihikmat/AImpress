
document.addEventListener('DOMContentLoaded', function() {
// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

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
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Video initialization and error handling
const video = document.getElementById('bgVideo');
const videoBackground = document.querySelector('.video-background');

if (video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.style.opacity = '1'; // Ensure visible

    const playVideo = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked → play on first user interaction
                const playOnInteraction = () => video.play();
                document.addEventListener('click', playOnInteraction, { once: true });
                document.addEventListener('touchstart', playOnInteraction, { once: true });
                document.addEventListener('keydown', playOnInteraction, { once: true });
            });
        }
    };

    video.addEventListener('loadedmetadata', playVideo);
    video.addEventListener('canplay', playVideo);

    video.addEventListener('ended', () => {
        video.currentTime = 0.001;
        video.play();
    });

    video.addEventListener('error', () => {
        console.log('Video failed to load. Applying fallback background.');
        videoBackground.style.background = 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)';
        videoBackground.innerHTML = `
            <div style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; text-align:center; z-index:1;">
                <h3>Loading background...</h3>
            </div>
        `;
    });

    video.load();
    if (document.readyState === 'complete') playVideo();
    else window.addEventListener('load', playVideo);
}

// Contact form submission
// main.js
// Contact form submission - clean version
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const responseEl = document.getElementById("form-response");

  if (form && responseEl) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Show loading state
      responseEl.textContent = "Sending message...";
      responseEl.style.color = "#007bff";

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        service: document.getElementById("service").value,
        message: document.getElementById("message").value,
      };

      try {
        const res = await fetch("/contact", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        
        responseEl.textContent = data.msg;
        responseEl.style.color = data.success ? "green" : "red";
        
        if (data.success) {
          form.reset();
          // Optional: Hide success message after 5 seconds
          setTimeout(() => {
            responseEl.textContent = "";
          }, 5000);
        }
      } catch (err) {
        console.error("Form submission error:", err);
        responseEl.textContent = "Error submitting form. Please try again.";
        responseEl.style.color = "red";
      }
    });
  } else {
    console.error("Contact form or response element not found");
  }
});




// Active section highlighting in navigation
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

// Initialize animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .workshop-card, .stat').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add staggered animation delays
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

document.querySelectorAll('.workshop-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

// Language switching functionality
const languageSwitcher = {
    currentLang: 'en',
    
    translations: {
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.workshops': 'Workshops',
            'nav.about': 'About',
            'nav.contact': 'Contact',
            'nav.book': 'Book Session',
            
            // Hero Section
            'hero.title': 'Transform Your Business with AI',
            'hero.subtitle': 'Expert workshops, personalized coaching, and custom AI solutions to accelerate your digital transformation',
            'hero.cta1': 'Schedule Consultation',
            'hero.cta2': 'Our Services',
            
            // Services Section
            'services.title': 'Our Services',
            'services.workshops.title': 'AI Workshops',
            'services.workshops.desc': 'Interactive workshops covering machine learning, automation, and AI implementation strategies for businesses of all sizes.',
            'services.workshops.feature1': 'Hands-on learning experience',
            'services.workshops.feature2': 'Industry-specific use cases',
            'services.workshops.feature3': 'Certificate of completion',
            
            'services.coaching.title': 'AI Coaching',
            'services.coaching.desc': 'One-on-one coaching sessions to help you develop AI strategies, implement solutions, and overcome technical challenges.',
            'services.coaching.feature1': 'Personalized guidance',
            'services.coaching.feature2': 'Strategic planning',
            'services.coaching.feature3': 'Ongoing support',
            
            'services.development.title': 'AI Development',
            'services.development.desc': 'Custom AI solutions tailored to your specific business needs, from chatbots to predictive analytics systems.',
            'services.development.feature1': 'Custom development',
            'services.development.feature2': 'Integration support',
            'services.development.feature3': 'Maintenance & updates',
            
            // Workshops Section
            'workshops.title': 'Upcoming Workshops',
            'workshops.sep': 'Sep',
            'workshops.workshop1.title': 'Introduction to Machine Learning',
            'workshops.workshop1.desc': 'Learn the fundamentals of ML algorithms and their practical applications in business environments.',
            'workshops.workshop1.duration': '3 hours',
            'workshops.workshop1.participants': 'Max 20 participants',
            
            'workshops.workshop2.title': 'AI for Business Automation',
            'workshops.workshop2.desc': 'Discover how to automate business processes using AI tools and increase operational efficiency.',
            'workshops.workshop2.duration': '4 hours',
            'workshops.workshop2.participants': 'Max 15 participants',
            
            'workshops.workshop3.title': 'Building AI Chatbots',
            'workshops.workshop3.desc': 'Hands-on workshop to create intelligent chatbots for customer service and lead generation.',
            'workshops.workshop3.duration': '5 hours',
            'workshops.workshop3.participants': 'Max 12 participants',
            
            'workshops.register': 'Register Now',
            
            // About Section
            'about.title': 'About AImpress',
            'about.desc': 'We are a team of AI experts passionate about helping businesses harness the power of artificial intelligence. With over 10 years of combined experience in machine learning, data science, and business automation, we provide practical, results-driven AI solutions.',
            'about.stat1': 'Clients Served',
            'about.stat2': 'Workshops Delivered',
            'about.stat3': 'Client Satisfaction',
            
            // Appointment Section
            'appointment.title': 'Book Your Session',
            'appointment.ready': 'Ready to get started?',
            'appointment.desc': 'Schedule a consultation or book a workshop slot using our integrated calendar system.',
            'appointment.location': 'Gruentalerstraße 4, 4020 Linz',
            'appointment.select': 'Select a Date & Time',
            'appointment.available': 'Available Times',
            'appointment.add': 'Add to Google Calendar',
            
            // Contact Section
            'contact.title': 'Get in Touch',
            'contact.name': 'Your Name',
            'contact.email': 'Your Email',
            'contact.select': 'Select a Service',
            'contact.workshop': 'Workshop',
            'contact.coaching': '1-on-1 Coaching',
            'contact.development': 'AI Development',
            'contact.consultation': 'Consultation',
            'contact.message': 'Tell us about your project or questions',
            'contact.send': 'Send Message',
            'contact.map': 'Gruentalerstraße 4, 4020 Linz',
            
            // Footer
            'footer.desc': 'Transforming businesses through AI innovation and education.',
            'footer.services': 'Services',
            'footer.workshops': 'AI Workshops',
            'footer.coaching': 'AI Coaching',
            'footer.development': 'AI Development',
            'footer.contact': 'Contact',
            'footer.email': 'Email: info@aisolutionshub.com',
            'footer.phone': 'Phone: +43 123 456 7890',
            'footer.location': 'Location: Gruentalerstraße 4, 4020 Linz',
            'footer.rights': 'All rights reserved.'
        },
        de: {
            // Navigation
            'nav.home': 'Startseite',
            'nav.services': 'Dienstleistungen',
            'nav.workshops': 'Workshops',
            'nav.about': 'Über uns',
            'nav.contact': 'Kontakt',
            'nav.book': 'Termin buchen',
            
            // Hero Section
            'hero.title': 'Transformieren Sie Ihr Unternehmen mit KI',
            'hero.subtitle': 'Experten-Workshops, persönliches Coaching und maßgeschneiderte KI-Lösungen zur Beschleunigung Ihrer digitalen Transformation',
            'hero.cta1': 'Konsultation vereinbaren',
            'hero.cta2': 'Unsere Dienstleistungen',
            
            // Services Section
            'services.title': 'Unsere Dienstleistungen',
            'services.workshops.title': 'KI-Workshops',
            'services.workshops.desc': 'Interaktive Workshops zu maschinellem Lernen, Automatisierung und KI-Implementierungsstrategien für Unternehmen jeder Größe.',
            'services.workshops.feature1': 'Praktische Lernerfahrung',
            'services.workshops.feature2': 'Branchenspezifische Anwendungsfälle',
            'services.workshops.feature3': 'Teilnahmezertifikat',
            
            'services.coaching.title': 'KI-Coaching',
            'services.coaching.desc': 'Einzelcoaching-Sitzungen zur Entwicklung von KI-Strategien, Implementierung von Lösungen und Überwindung technischer Herausforderungen.',
            'services.coaching.feature1': 'Persönliche Betreuung',
            'services.coaching.feature2': 'Strategische Planung',
            'services.coaching.feature3': 'Laufende Unterstützung',
            
            'services.development.title': 'KI-Entwicklung',
            'services.development.desc': 'Maßgeschneiderte KI-Lösungen für Ihre spezifischen Geschäftsanforderungen, von Chatbots bis zu Predictive-Analytics-Systemen.',
            'services.development.feature1': 'Individuelle Entwicklung',
            'services.development.feature2': 'Integrationsunterstützung',
            'services.development.feature3': 'Wartung & Updates',
            
            // Workshops Section
            'workshops.title': 'Kommende Workshops',
            'workshops.sep': 'Sep',
            'workshops.workshop1.title': 'Einführung in Machine Learning',
            'workshops.workshop1.desc': 'Lernen Sie die Grundlagen von ML-Algorithmen und deren praktische Anwendung in Geschäftsumgebungen.',
            'workshops.workshop1.duration': '3 Stunden',
            'workshops.workshop1.participants': 'Max. 20 Teilnehmer',
            
            'workshops.workshop2.title': 'KI für Geschäftsautomatisierung',
            'workshops.workshop2.desc': 'Entdecken Sie, wie Sie Geschäftsprozesse mit KI-Tools automatisieren und die operative Effizienz steigern.',
            'workshops.workshop2.duration': '4 Stunden',
            'workshops.workshop2.participants': 'Max. 15 Teilnehmer',
            
            'workshops.workshop3.title': 'KI-Chatbots entwickeln',
            'workshops.workshop3.desc': 'Praktischer Workshop zur Erstellung intelligenter Chatbots für Kundenservice und Lead-Generierung.',
            'workshops.workshop3.duration': '5 Stunden',
            'workshops.workshop3.participants': 'Max. 12 Teilnehmer',
            
            'workshops.register': 'Jetzt anmelden',
            
            // About Section
            'about.title': 'Über AImpress',
            'about.desc': 'Wir sind ein Team von KI-Experten, das leidenschaftlich daran arbeitet, Unternehmen dabei zu helfen, die Kraft der künstlichen Intelligenz zu nutzen. Mit über 10 Jahren kombinierter Erfahrung in maschinellem Lernen, Data Science und Geschäftsautomatisierung bieten wir praktische, ergebnisorientierte KI-Lösungen.',
            'about.stat1': 'Kunden betreut',
            'about.stat2': 'Workshops durchgeführt',
            'about.stat3': 'Kundenzufriedenheit',
            
            // Appointment Section
            'appointment.title': 'Buchen Sie Ihre Sitzung',
            'appointment.ready': 'Bereit zu starten?',
            'appointment.desc': 'Vereinbaren Sie eine Konsultation oder buchen Sie einen Workshop-Platz über unser integriertes Kalendersystem.',
            'appointment.location': 'Gruentalerstraße 4, 4020 Linz',
            'appointment.select': 'Datum & Uhrzeit wählen',
            'appointment.available': 'Verfügbare Zeiten',
            'appointment.add': 'Zu Google Kalender hinzufügen',
            
            // Contact Section
            'contact.title': 'Kontaktieren Sie uns',
            'contact.name': 'Ihr Name',
            'contact.email': 'Ihre E-Mail',
            'contact.select': 'Dienstleistung auswählen',
            'contact.workshop': 'Workshop',
            'contact.coaching': 'Einzelcoaching',
            'contact.development': 'KI-Entwicklung',
            'contact.consultation': 'Konsultation',
            'contact.message': 'Erzählen Sie uns von Ihrem Projekt oder Ihren Fragen',
            'contact.send': 'Nachricht senden',
            'contact.map': 'Gruentalerstraße 4, 4020 Linz',
            
            // Footer
            'footer.desc': 'Transformation von Unternehmen durch KI-Innovation und Bildung.',
            'footer.services': 'Dienstleistungen',
            'footer.workshops': 'KI-Workshops',
            'footer.coaching': 'KI-Coaching',
            'footer.development': 'KI-Entwicklung',
            'footer.contact': 'Kontakt',
            'footer.email': 'E-Mail: info@aisolutionshub.com',
            'footer.phone': 'Telefon: +43 123 456 7890',
            'footer.location': 'Standort: Gruentalerstraße 4, 4020 Linz',
            'footer.rights': 'Alle Rechte vorbehalten.'
        }
    },
    
    init() {
        // Load saved language preference or detect browser language
        const savedLang = localStorage.getItem('preferred-language');
        const browserLang = navigator.language.startsWith('de') ? 'de' : 'en';
        this.currentLang = savedLang || browserLang;
        
        // Apply the language
        this.applyLanguage(this.currentLang);
        
        // Set up language switcher event listeners
        this.setupLanguageSwitcher();
    },
    
    applyLanguage(lang) {
        this.currentLang = lang;
        
        // Update language attribute on html element
        document.documentElement.lang = lang;
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[lang] && this.translations[lang][key]) {
                element.textContent = this.translations[lang][key];
            }
        });
        
        // Update placeholder texts
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (this.translations[lang] && this.translations[lang][key]) {
                element.placeholder = this.translations[lang][key];
            }
        });
        
        // Update option texts in select elements
        document.querySelectorAll('option[data-translate]').forEach(option => {
            const key = option.getAttribute('data-translate');
            if (this.translations[lang] && this.translations[lang][key]) {
                option.textContent = this.translations[lang][key];
            }
        });
        
        // Update active state of language buttons
        document.querySelectorAll('.lang-option').forEach(button => {
            if (button.getAttribute('data-lang') === lang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Save preference
        localStorage.setItem('preferred-language', lang);
    },
    
    setupLanguageSwitcher() {
        document.querySelectorAll('.lang-option').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                this.applyLanguage(lang);
            });
        });
    }
};

// Initialize language switcher
languageSwitcher.init();

});



// Utility function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  const icon = type === "success" ? "check" : type === "error" ? "times" : "info";

  notification.innerHTML = `
    <i class="fas fa-${icon}-circle"></i>
    <span>${message}</span>
  `;

  // Append to body (or container)
  document.body.appendChild(notification);

  // Auto remove after 3s
  setTimeout(() => {
    notification.remove();
  }, 3000);
}


// Export functions for other modules
window.AIAgency = {
showNotification
};