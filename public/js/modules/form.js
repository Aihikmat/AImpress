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
                
                this.responseEl.textContent = data.msg;
                this.responseEl.style.color = data.success ? "green" : "red";
                
                if (data.success) {
                    this.form.reset();
                    // Optional: Hide success message after 5 seconds
                    setTimeout(() => {
                        this.responseEl.textContent = "";
                    }, 5000);
                }
            } catch (err) {
                console.error("Form submission error:", err);
                this.responseEl.textContent = "Error submitting form. Please try again.";
                this.responseEl.style.color = "red";
            }
        });
    }
}

// Make FormHandler globally available
window.FormHandler = FormHandler;

// Initialize when DOM is ready
if (document.readyState !== 'loading') {
    new FormHandler();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        new FormHandler();
    });
}