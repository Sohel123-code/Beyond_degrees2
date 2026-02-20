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

const inspectTable = async () => {
    console.log('Inspecting "career skills" table...');
    const { data, error } = await supabase
        .from('career skills')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else if (data && data.length > 0) {
        console.log('Sample row keys:', Object.keys(data[0]));
        console.log('Sample data:', data[0]);
    } else {
        console.log('Table is empty or not found.');
        // Try to fetch column information if possible via RPC or just assume it's empty
    }
};

inspectTable();
