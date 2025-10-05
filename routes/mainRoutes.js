import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Initialize Supabase client (these will be passed from server.js)
let supabase;

export function initializeRoutes(supabaseClient) {
  supabase = supabaseClient;
  
  // Serve the main HTML file
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  });

  // Serve the users messages HTML file
  router.get('/users_messages', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/users_messages.html'));
  });

  // API endpoint to provide environment variables to frontend
  router.get('/api/config', (req, res) => {
    res.json({
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_CONTACT: process.env.EMAILJS_TEMPLATE_CONTACT,
      EMAILJS_TEMPLATE_REGISTRATION: process.env.EMAILJS_TEMPLATE_REGISTRATION,
      EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY
    });
  });

  // Handle form submission
  router.post("/contact", async (req, res) => {
    try {
      const { name, email, service, message } = req.body;

      // Validate required fields
      if (!name || !email || !service || !message) {
        return res.status(400).json({
          success: false,
          msg: "All fields are required"
        });
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            name: name,
            email: email,
            service: service,
            message: message
          }
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({
          success: false,
          msg: "Database error: " + error.message
        });
      }

      console.log("Contact form submitted:", { name, email, service });
      console.log("Supabase response:", data);

      // Return JSON response as expected by the frontend
      res.json({
        success: true,
        msg: "Thank you! Your message has been sent successfully."
      });

    } catch (error) {
      console.error("Error saving contact:", error);
      res.status(500).json({
        success: false,
        msg: "An error occurred while sending your message. Please try again."
      });
    }
  });

  // API endpoint to view submitted contacts (for testing)
  router.get("/api/contacts", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ error: "Failed to fetch contacts: " + error.message });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });
  
  return router;
}

// Add these routes INSIDE the initializeRoutes function, before the return statement
router.get('/impressum', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/impressum.html'));
});

router.get('/datenschutz', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/datenschutz.html'));
});

router.get('/abg', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/abg.html'));
});


router.get('/index.html', (req, res) => {
  res.redirect('/');
});