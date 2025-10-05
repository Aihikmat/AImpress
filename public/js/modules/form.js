import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabase = createClient("https://rdqzljpynbpjyvstgain.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcXpsanB5bmJwanl2c3RnYWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjEyODIsImV4cCI6MjA3NDM5NzI4Mn0.xcCxyptcmZGIvXLvNyAQ9VBmsQ9PoRaGlZglXVdhxAI");


// Form Module
class FormHandler {
    constructor() {
        this.form = document.getElementById("contact-form");
        this.sendBtn = document.querySelector(".send_btn");
        this.responseEl = document.getElementById("form-response");
        this.init();
    }

    init() {
        if (this.form && this.sendBtn && this.responseEl) {
            this.setupFormSubmission();
        } else {
            console.error("Contact form, send button, or response element not found");
        }
    }

    setupFormSubmission() {
        this.sendBtn.addEventListener("click", async (e) => {
            e.preventDefault();

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
                    await emailjs.send(
                        "service_02oh34n",      // Your EmailJS service ID
                        "template_pmhl1b5", // Your EmailJS template ID for contact form
                        {
                            name: formData.name,
                            email: formData.email,
                            service: formData.service,
                            message: formData.message,
                            // Add any additional fields your template expects
                        },
                        "RTcCPe5HnNYWL0IlB"     // Your EmailJS public key
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