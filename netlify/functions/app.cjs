const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// API endpoint for config
app.get('/api/config', (req, res) => {
  console.log('API config request');
  res.json({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_CONTACT: process.env.EMAILJS_TEMPLATE_CONTACT,
    EMAILJS_TEMPLATE_REGISTRATION: process.env.EMAILJS_TEMPLATE_REGISTRATION,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY
  });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission');
  // In a real implementation, you would handle the contact form submission here
  // For now, we'll just return a success response
  res.json({ success: true, message: 'Form submitted successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something broke! Error: ' + err.message);
});

// Wrap with serverless-http
const handler = serverless(app);

module.exports.handler = handler;