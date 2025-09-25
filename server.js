import express from "express";
import bodyParser from "body-parser";
import { createClient } from '@supabase/supabase-js';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { initializeRoutes } from './routes/mainRoutes.js';

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
app.use(express.static(path.join(__dirname, 'public')));

// Initialize routes
const mainRoutes = initializeRoutes(supabase);
app.use('/', mainRoutes);

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});