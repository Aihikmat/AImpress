import express from "express";
import bodyParser from "body-parser";
import { createClient } from '@supabase/supabase-js';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index1.html'));
});

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('Supabase table not found or accessible. Make sure to create the contacts table.');
      console.log('Error:', error.message);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (error) {
    console.error('Supabase connection failed:', error);
  }
}

// Initialize and test connection
testSupabaseConnection();

// Handle form submission
app.post("/contact", async (req, res) => {
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

// Optional: Add an endpoint to view submitted contacts (for testing)
app.get("/contacts", async (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});