import { getCareerRecommendations, getCareerDetails } from './server/services/groqService.js';
import dotenv from 'dotenv';

dotenv.config();

const testProfile = {
    branch: "Computer Science",
    year: "3rd Year",
    domain: "Artificial Intelligence",
    salary: "12,00,000",
    skills: "Python, Machine Learning, TensorFlow, SQL",
    experience: "Intermediate",
    careerGoal: "AI Researcher",
    location: {
        country: "India",
        state: "Karnataka"
    }
};

const runTest = async () => {
    console.log("Testing Groq Career Recommendations...");
    try {
        const recommendations = await getCareerRecommendations(testProfile);
        console.log("\nRecommendations Result:");
        console.log(JSON.stringify(recommendations, null, 2));

        if (recommendations && recommendations.recommendations && recommendations.recommendations.length > 0) {
            const firstCareer = recommendations.recommendations[0].title;
            console.log(`\nTesting Career Details for: ${firstCareer}...`);
            const details = await getCareerDetails(firstCareer, testProfile);
            console.log("\nCareer Details Result:");
            console.log(JSON.stringify(details, null, 2));
        } else {
            console.log("No recommendations returned to test details.");
        }

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

runTest();
