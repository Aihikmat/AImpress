# AImpress Website

A modern, responsive website for an AI agency offering workshops, coaching, and development services.

## Deployment to Netlify

This site is configured for deployment to Netlify with the following setup:

### Netlify Configuration

1. **Netlify Functions**: The Express.js server is deployed as a Netlify Function
2. **Static Assets**: All static assets in the `public` directory are served directly
3. **API Routes**: API endpoints are handled by the Netlify Function
4. **SPA Routing**: All non-API routes serve the main index.html for client-side routing

### Deployment Steps

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy to Netlify**:
   ```bash
   netlify deploy
   ```
   
   For production deployment:
   ```bash
   netlify deploy --prod
   ```

### Local Development

To run the site locally with Netlify functions:

```bash
netlify dev
```

This will start the development server on http://localhost:8888

### Environment Variables

Make sure to set the following environment variables in Netlify:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `EMAILJS_SERVICE_ID` - Your EmailJS service ID
- `EMAILJS_TEMPLATE_CONTACT` - Your EmailJS contact template ID
- `EMAILJS_TEMPLATE_REGISTRATION` - Your EmailJS registration template ID
- `EMAILJS_PUBLIC_KEY` - Your EmailJS public key

### Project Structure

```
.
├── public/                 # Static assets
├── views/                  # HTML pages
├── netlify/functions/      # Netlify functions
├── server.js              # Main Express server (for local development)
├── netlify.toml           # Netlify configuration
└── package.json           # Project dependencies and scripts
```

### Build Process

This is a static site with serverless functions, so no build step is required. Netlify will automatically deploy the static assets and functions.