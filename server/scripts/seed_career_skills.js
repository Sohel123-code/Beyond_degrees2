import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../api/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedData = async () => {
    try {
        const filePath = path.join(__dirname, '../../src/data/career.json');
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`Read ${rawData.length} items from career.json`);

        const formattedData = rawData.map((item, index) => ({
            category: 'Career Skills',
            subcategory: item.title,
            video_number: (index + 1).toString(),
            youtube_url: item.link
        }));

        const { data, error } = await supabase
            .from('career skills')
            .insert(formattedData);

        if (error) {
            console.error('Error seeding data:', error);
        } else {
            console.log('Successfully seeded career_skills table!');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
};

seedData();
