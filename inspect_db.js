import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from api directory or current directory
dotenv.config({ path: path.resolve(__dirname, 'api', '.env') });
// Fallback if that didn't work (depending on where script is run)
if (!process.env.SUPABASE_URL) {
    dotenv.config();
}

console.log('Connecting to:', process.env.SUPABASE_URL);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const inspect = async () => {
    console.log('Fetching one user to check schema...');
    const { data, error } = await supabase
        .from('USERS')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching user:', error);
        return;
    }

    if (data && data.length > 0) {
        const user = data[0];
        const keys = Object.keys(user);
        console.log('User found. Keys:', keys);

        const requiredColumns = ['branch', 'year', 'domain', 'salary', 'hobby'];
        const missing = requiredColumns.filter(col => !keys.includes(col));

        if (missing.length > 0) {
            console.error('❌ MISSING COLUMNS:', missing.join(', '));
            console.log('Please run server/add_survey_columns.sql in Supabase SQL Editor.');
        } else {
            console.log('✅ All survey columns are present.');
        }
    } else {
        console.log('No users found. Cannot verify schema structure fully from data.');
    }
};

inspect();
