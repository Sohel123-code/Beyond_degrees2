
import dotenv from 'dotenv';
import { getCareerRecommendations } from './server/services/groqService.js';

dotenv.config();

const mockUser = {
    branch: 'Computer Science',
    year: '3rd Year',
    domain: 'Web Development',
    salary: '600000',
    skills: 'JavaScript, React, Node.js',
    experience: 'Intermediate',
    careerGoal: 'Full Stack Developer',
    location: {
        country: 'India',
        state: 'Karnataka'
    }
};

const mockSoftwareRoles = [
    { Title: 'Software Engineer', ExperienceLevel: 'Entry Level' },
    { Title: 'Frontend Developer', ExperienceLevel: 'Entry Level' }
];

async function testGroq() {
    console.log('Testing Groq API...');
    console.log('API Key present?', !!process.env.GROQ_API_KEY2);

    if (!process.env.GROQ_API_KEY2) {
        console.error('ERROR: GROQ_API_KEY2 is missing in .env');
        return;
    }

    try {
        const result = await getCareerRecommendations(mockUser, mockSoftwareRoles);
        console.log('Success! Recommendations:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Groq Test Failed:', error);
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
        }
    }
}

testGroq();
