import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../api/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const listTables = async () => {
    console.log('Listing tables in public schema...');

    // Supabase JS doesn't have a direct "list tables" without RPC or direct postgres query
    // But we can try to query a common table or use a trick
    // Since we don't have direct SQL access here, let's try some common names

    const tablesToTry = ['career skills', 'career_skills', 'Career Skills', 'CareerSkills'];

    for (const table of tablesToTry) {
        try {
            const { data, error } = await supabase.from(table).select('*').limit(0);
            if (!error) {
                console.log(`✅ Table "${table}" exists.`);
            } else {
                console.log(`❌ Table "${table}" does not exist or error: ${error.message}`);
            }
        } catch (e) {
            console.log(`❌ Error querying "${table}": ${e.message}`);
        }
    }
};

listTables();
