let supabase;

// ✅ DOM elements
const registrationForm = document.getElementById("registrationForm");
const workshopInput = document.getElementById("workshopInput");
const form = document.getElementById("workshopForm");

// Initialize Supabase client
async function initSupabase() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm");
        supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    } catch (error) {
        console.error("Failed to load environment variables:", error);
        // Show an error to the user if env vars are not available
        alert("❌ Configuration error. Please contact support.");
    }
}

initSupabase();

// ✅ Register button click → open form
document.querySelectorAll(".register-btn").forEach((button) => {
  button.setAttribute("type", "button"); // prevent accidental submit
  button.addEventListener("click", () => {
    console.log("Register button clicked:", button.dataset.workshop); // Debug log
    form.reset(); // clear old values
    workshopInput.value = button.dataset.workshop;
    registrationForm.style.display = "flex"; // show overlay
  });
});

// ✅ Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Check if Supabase is initialized
  if (!supabase) {
    alert("❌ Configuration error. Please contact support.");
    return;
  }

  const data = {
    workshop: workshopInput.value,
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    dob: document.getElementById("dob").value,
    address: document.getElementById("address").value,
  };

  console.log("Submitting data:", data); // Debug log

  // 1. Save registration in Supabase
  const { error } = await supabase.from("registrations").insert([data]);

  if (error) {
    alert("❌ Error: " + error.message);
    return;
  }

  // 2. Send confirmation email with EmailJS
  try {
    // Fetch EmailJS config
    const response = await fetch('/api/config');
    const config = await response.json();
    
    emailjs.send(
      config.EMAILJS_SERVICE_ID,      // ✅ Your EmailJS service ID
      config.EMAILJS_TEMPLATE_REGISTRATION,     // ✅ Your EmailJS template ID
      {
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        workshop: data.workshop,
        dob: data.dob,
        address: data.address,
      },
      config.EMAILJS_PUBLIC_KEY     // ✅ Your EmailJS public key
    )
    .then(() => {
      alert("✅ Registration submitted! You'll receive a confirmation email soon.");
      registrationForm.style.display = "none";
    }, (err) => {
      console.error("EmailJS error:", err);
      alert("⚠️ Registration saved, but email could not be sent. Please contact support.");
    });
  } catch (err) {
    console.error("Email error:", err);
    alert("⚠️ Registration saved, but email could not be sent. Please contact support.");
  }
});

// ✅ Close form with Cancel
document.getElementById("closeForm").addEventListener("click", () => {
  console.log("Form closed (Cancel button).");
  registrationForm.style.display = "none";
});

// ✅ Close form when clicking outside the form container
registrationForm.addEventListener("click", (e) => {
  if (e.target === registrationForm) {
    console.log("Form closed (clicked outside).");
    registrationForm.style.display = "none";
  }
});