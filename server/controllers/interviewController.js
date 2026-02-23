import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY3;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const generateQuestions = async (req, res) => {
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    const prompt = `
    Generate 6 MCQ interview questions for the role: ${role}.
    
    Rules:
    - 2 Concept questions (theoretical knowledge)
    - 1 Scenario question (problem-solving in context)
    - 1 Code logic or technical logic question (related to the specific role)
    - 1 Behavioral question
    - 1 Aptitude question (General logical reasoning, quantitative aptitude, or verbal ability)
    - Each question must have 4 options (A, B, C, D)
    - Only one correct answer
    - Difficulty: Medium
    - Keep questions and options concise and highly relevant to the role of ${role} (except for the aptitude question which can be general).
    
    Return the response ONLY as a JSON array of objects with the following structure:
    [
      {
        "id": 1,
        "category": "Concept",
        "question": "The question text",
        "options": {
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D"
        },
        "correctAnswer": "A",
        "explanation": "Brief explanation of why A is correct"
      }
    ]
  `;

    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert interviewer and career coach. You provide concise, highly relevant technical and behavioral interview questions in JSON format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' }
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        let content = response.data.choices[0].message.content;

        // Parse JSON
        let questions;
        try {
            const parsed = JSON.parse(content);
            // Groq might return { "questions": [...] } or just [...]
            questions = parsed.questions || parsed;
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }

        res.json({ questions });
    } catch (error) {
        console.error('Error generating questions:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate interview questions' });
    }
};
