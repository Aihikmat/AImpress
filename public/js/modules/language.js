// Language Module
class LanguageSwitcher {
   
    constructor() {
        console.log('LanguageSwitcher constructor called');
        this.currentLang = 'en';
        this.init();
    }

    init() {
        console.log('LanguageSwitcher init called');
        // Load saved language preference or detect browser language
        const savedLang = localStorage.getItem('preferred-language');
        const browserLang = navigator.language.startsWith('de') ? 'de' : 'en';
        this.currentLang = savedLang || browserLang;
        
        // Apply the language
        this.applyLanguage(this.currentLang);
        
        // Set up language switcher event listeners
        this.setupLanguageSwitcher();
    }

    applyLanguage(lang) {
        console.log('Applying language:', lang);
        this.currentLang = lang;
        
        // Update language attribute on html element
        document.documentElement.lang = lang;
        
        // Check if translations object exists
        if (!window.translations) {
            console.error('Translations object not found');
            return;
        }
        
        // Check if the requested language exists
        if (!window.translations[lang]) {
            console.error('Language not found:', lang);
            return;
        }
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (key && window.translations[lang] && window.translations[lang][key]) {
                element.textContent = window.translations[lang][key];
            }
        });
        
        // Update placeholder texts
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (key && window.translations[lang] && window.translations[lang][key]) {
                element.placeholder = window.translations[lang][key];
            }
        });
        
        // Update option texts in select elements
        document.querySelectorAll('option[data-translate]').forEach(option => {
            const key = option.getAttribute('data-translate');
            if (key && window.translations[lang] && window.translations[lang][key]) {
                option.textContent = window.translations[lang][key];
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
    }

    setupLanguageSwitcher() {
        // Attach event listeners immediately since we're already in a DOMContentLoaded event
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Directly attach event listeners to language buttons
        const langButtons = document.querySelectorAll('.lang-option');
        
        // Debug: Check if buttons are found
        console.log('Language buttons found:', langButtons.length);
        
        if (langButtons.length === 0) {
            console.error('No language buttons found!');
            return;
        }
        
        langButtons.forEach((button, index) => {
            console.log('Attaching event to button ' + index + ':', button);
            // Remove any existing event listeners to prevent duplicates
            button.removeEventListener('click', this.handleLanguageChange);
            // Bind the event handler to preserve 'this' context
            const handler = (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                console.log('Language switch clicked:', lang);
                this.applyLanguage(lang);
            };
            button.addEventListener('click', handler);
            // Store reference to handler for potential cleanup
            button.languageSwitchHandler = handler;
        });
    }
}

// Make LanguageSwitcher globally available
window.LanguageSwitcher = LanguageSwitcher;

// Only initialize if not already initialized
function initializeLanguageSwitcher() {
    if (typeof window.languageSwitcherInstance === 'undefined') {
        window.languageSwitcherInstance = new LanguageSwitcher();
    }
}

// Check if document is already loaded
if (document.readyState === 'loading') {
    // Document is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeLanguageSwitcher);
} else {
    // Document is already loaded, initialize immediately
    initializeLanguageSwitcher();
}