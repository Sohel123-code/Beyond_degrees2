import { supabase } from './server/config/supabase.js';

async function inspectRoles() {
    const { data, error } = await supabase
        .from('roles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching roles:', error);
    } else {
        console.log('Roles table sample:', data);
        if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        }
    }
}

inspectRoles();
