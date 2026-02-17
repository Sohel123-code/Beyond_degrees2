import { supabase } from '../config/supabase.js';
import { getCareerRecommendations, getCareerDetails } from '../services/groqService.js';

export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Start Recommendation for User:", userId);
        console.log("Recommendation Key:", process.env.GROQ_API_KEY2);

        // Fetch user profile with survey data
        const { data: user, error } = await supabase
            .from('USERS')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) {
            console.error('Error fetching user for recommendations:', error);
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if survey data exists
        if (!user.branch && !user.interests && !user.domain) {
            return res.status(400).json({
                error: 'Survey incomplete',
                message: 'Please complete the career interest survey first.'
            });
        }

        // Generate recommendations
        const recommendations = await getCareerRecommendations(user);

        res.json(recommendations);

    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};

export const getCareerDetail = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ error: 'Career title is required' });
        }

        // Fetch user profile for context
        const { data: user, error } = await supabase
            .from('USERS')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate detailed info
        const details = await getCareerDetails(title, user);
        res.json(details);

    } catch (error) {
        console.error('Career detail error:', error);
        res.status(500).json({ error: 'Failed to fetch career details' });
    }
};
