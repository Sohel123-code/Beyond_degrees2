
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to point to api/.env or root .env
dotenv.config({ path: path.join(__dirname, '../../api/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
    console.log('Checking table "software"...');
    const { data, error } = await supabase
        .from('software')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error querying "software":', error.message);

        // Try 'Software' or 'softwares'
        console.log('Trying "Software"...');
        const { data: data2, error: error2 } = await supabase.from('Software').select('*').limit(1);
        if (error2) console.error('Error querying "Software":', error2.message);
        else console.log('Found "Software" table keys:', data2.length ? Object.keys(data2[0]) : 'Empty table');

        return;
    }

    if (data && data.length > 0) {
        console.log('Found "software" table. Columns:', Object.keys(data[0]));
        console.log('Sample row:', data[0]);
    } else {
        console.log('Found "software" table but it is empty.');
    }
}

checkTable();
