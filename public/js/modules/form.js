// Initialize Supabase client
let supabase;


// Form Module
class FormHandler {
    constructor() {
        this.form = document.getElementById("contact-form");
        this.sendBtn = document.querySelector(".send_btn");
        this.responseEl = document.getElementById("form-response");
        this.init();
    }

    async init() {
        // Fetch environment variables
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            
            // Initialize Supabase client with environment variables
            const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm");
            supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
        } catch (error) {
            console.error("Failed to load environment variables:", error);
            // Show an error to the user if env vars are not available
            if (this.responseEl) {
                this.responseEl.textContent = "❌ Configuration error. Please contact support.";
                this.responseEl.style.color = "red";
            }
        }
        
        if (this.form && this.sendBtn && this.responseEl) {
            this.setupFormSubmission();
        } else {
            console.error("Contact form, send button, or response element not found");
        }
    }

    setupFormSubmission() {
        this.sendBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            // Check if Supabase is initialized
            if (!supabase) {
                this.responseEl.textContent = "❌ Configuration error. Please contact support.";
                this.responseEl.style.color = "red";
                return;
            }

            // Show loading state
            this.responseEl.textContent = "Sending message...";
            this.responseEl.style.color = "#007bff";

            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                service: document.getElementById("service").value,
                message: document.getElementById("message").value,
                created_at: new Date().toISOString()
            };

            console.log("Submitting contact form data:", formData);

            try {
                // 1. Save to Supabase
                const { error: supabaseError } = await supabase
                    .from("contacts")
                    .insert([formData]);

                if (supabaseError) {
                    throw new Error(`Supabase error: ${supabaseError.message}`);
                }

                // 2. Send confirmation email with EmailJS
                try {
                    // Fetch EmailJS config
                    const response = await fetch('/api/config');
                    const config = await response.json();
                    
                    await emailjs.send(
                        config.EMAILJS_SERVICE_ID,      // Your EmailJS service ID
                        config.EMAILJS_TEMPLATE_CONTACT, // Your EmailJS template ID for contact form
                        {
                            name: formData.name,
                            email: formData.email,
                            service: formData.service,
                            message: formData.message,
                            // Add any additional fields your template expects
                        },
                        config.EMAILJS_PUBLIC_KEY     // Your EmailJS public key
                    );

                    // Success - both Supabase and EmailJS worked
                    this.responseEl.textContent = "✅ Message sent successfully! You'll receive a confirmation email soon.";
                    this.responseEl.style.color = "green";
                    this.form.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        this.responseEl.textContent = "";
                    }, 5000);

                } catch (emailError) {
                    console.error("EmailJS error:", emailError);
                    // Data saved but email failed
                    this.responseEl.textContent = "⚠️ Message saved, but confirmation email could not be sent. We'll contact you soon!";
                    this.responseEl.style.color = "orange";
                    this.form.reset();
                    
                    setTimeout(() => {
                        this.responseEl.textContent = "";
                    }, 7000);
                }

            } catch (error) {
                console.error("Form submission error:", error);
                this.responseEl.textContent = "❌ Error submitting form. Please try again.";
                this.responseEl.style.color = "red";
            }
        });
    }
}

// Export for module usage, but also make globally available for backward compatibility
window.FormHandler = FormHandler;
export default FormHandler;

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    new FormHandler();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        new FormHandler();
    });
}