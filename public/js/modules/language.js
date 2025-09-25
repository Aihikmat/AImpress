// Language Module
class LanguageSwitcher {
   
    constructor() {
        this.currentLang = 'en';
        this.init();
    }

    init() {
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
        this.currentLang = lang;
        
        // Update language attribute on html element
        document.documentElement.lang = lang;
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (window.translations[lang] && window.translations[lang][key]) {
                element.textContent = window.translations[lang][key];
            }
        });
        
        // Update placeholder texts
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (window.translations[lang] && window.translations[lang][key]) {
                element.placeholder = window.translations[lang][key];
            }
        });
        
        // Update option texts in select elements
        document.querySelectorAll('option[data-translate]').forEach(option => {
            const key = option.getAttribute('data-translate');
            if (window.translations[lang] && window.translations[lang][key]) {
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
        // Wait for DOM to be fully loaded before attaching event listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachEventListeners();
            });
        } else {
            // DOM is already loaded
            this.attachEventListeners();
        }
    }
    
    attachEventListeners() {
        // Directly attach event listeners to language buttons
        const langButtons = document.querySelectorAll('.lang-option');
        
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                this.applyLanguage(lang);
            });
        });
    }
}

// Make LanguageSwitcher globally available
window.LanguageSwitcher = LanguageSwitcher;

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    new LanguageSwitcher();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        new LanguageSwitcher();
    });
}