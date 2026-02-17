import { findUserByEmail, registerUser, verifyUserPassword } from '../services/userService.js';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { createClient } from '@supabase/supabase-js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValid = await verifyUserPassword(user, password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                user_name: user.user_name,
                image: user.image || ''
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = await registerUser(email, password, name);

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                user_name: user.user_name,
                image: ''
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

export const getProfile = async (req, res) => {
    console.log('Profile route hit - GET');
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('USERS')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return res.status(500).json({ error: 'Failed to fetch profile' });
        }

        res.json(data);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProfile = async (req, res) => {
    console.log('Profile route hit - PUT');
    try {
        const userId = req.user.id;
        let {
            name,
            education,
            interests,
            social_links,
            image,
            branch,
            year,
            domain,
            salary,
            skills,
            experience,
            careerGoal,
            location
        } = req.body;

        // ... (image handling code remains same) ...

        // Create service client for database operations (Bypasses RLS issues with anon key in node)
        const dbSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const toUpdate = {
            user_name: name,
            education,
            interests,
            'Social Links': social_links,
            image,
            branch,
            year,
            domain,
            salary,
            skills,
            experience,
            careerGoal,
            location: typeof location === 'object' ? JSON.stringify(location) : location,
        };

        // console.log("Updating Profile for User:", userId);
        // console.log("Update Payload:", JSON.stringify(toUpdate, null, 2));

        const { data, error } = await dbSupabase
            .from('USERS')
            .update(toUpdate)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', JSON.stringify(error, null, 2));
            return res.status(500).json({ error: 'Failed to update profile: ' + (error.message || error.details || 'Unknown error') });
        }

        res.json({ message: 'Profile updated', user: data });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
