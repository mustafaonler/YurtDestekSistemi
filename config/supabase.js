const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL ve Anon Key .env dosyasında tanımlanmalıdır');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 