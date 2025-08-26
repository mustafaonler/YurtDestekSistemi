const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Supabase client
const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 