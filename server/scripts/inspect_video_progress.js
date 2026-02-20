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

const inspectProgressTable = async () => {
    console.log('Inspecting "user_video_progress" table...');
    const { data, error } = await supabase
        .from('user_video_progress')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('✅ Table "user_video_progress" is accessible.');
        if (data && data.length > 0) {
            console.log('Sample data keys:', Object.keys(data[0]));
        } else {
            console.log('Table is currently empty.');
        }
    }
};

inspectProgressTable();
