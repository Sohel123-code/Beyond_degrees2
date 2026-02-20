import { supabase } from '../config/supabase.js';
import { getCareerRecommendations, getCareerDetails } from '../services/groqService.js';

export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user profile
        const { data: user, error } = await supabase
            .from('USERS')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get recommendations directly from Groq
        const aiRecommendations = await getCareerRecommendations(user);

        // Current frontend expects a specific structure.
        // The Service returns { recommendations: [...] }
        // We verify the structure matches what frontend needs.

        if (!aiRecommendations || !aiRecommendations.recommendations) {
            throw new Error("Invalid response from AI service");
        }

        // Log for debugging
        console.log("AI Recommendations generated:", aiRecommendations.recommendations.length);

        res.json(aiRecommendations);

    } catch (error) {
        console.error('CRITICAL RECOMMENDATION ERROR:', error);
        res.status(500).json({ error: 'Failed to generate recommendations', details: error.message });
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

        // Generate detailed info using Groq
        try {
            const details = await getCareerDetails(title, user);
            res.json(details);
        } catch (aiError) {
            console.error('AI Detail fetch failed:', aiError);
            res.status(500).json({
                error: "Failed to fetch details",
                message: "We could not generate the details at this time. Please try again."
            });
        }

    } catch (error) {
        console.error('Career detail error:', error);
        res.status(500).json({ error: 'Failed to fetch career details' });
    }
};
