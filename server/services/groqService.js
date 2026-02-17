import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GROQ_API_KEY2;

export const getCareerRecommendations = async (userProfile) => {
  if (!API_KEY) {
    throw new Error('GROQ_API_KEY2 is not defined in environment variables');
  }

  const groqRecommend = new Groq({
    apiKey: API_KEY
  });

  const prompt = `
    You are an expert career strategist, industry analyst, and academic mentor with strong knowledge of Indian and global job markets (2026 trends).
    
    Your task is to generate highly personalized, realistic, data-driven, and industry-relevant career recommendations.
    
    -----------------------------------
    STUDENT PROFILE:
    -----------------------------------
    Branch: ${userProfile.branch || 'Not specified'}
    Year of Study: ${userProfile.year || 'Not specified'}
    Primary Domain Interest: ${userProfile.domain || userProfile.interests || 'Not specified'}
    Expected Salary (in INR): ${userProfile.salary || 'Not specified'}
    Technical Skills: ${userProfile.skills || 'Not specified'}
    Experience Level: ${userProfile.experience || 'Not specified'}
    Career Goal: ${userProfile.careerGoal || 'Not specified'}
    Location Preference:
      - Country: ${userProfile.location?.country || 'Not specified'}
      - State: ${userProfile.location?.state || 'Not specified'}
    
    -----------------------------------
    ANALYSIS INSTRUCTIONS:
    -----------------------------------
    1. Evaluate alignment between student's technical skills and 2026 industry demand.
    2. Adjust recommendations strictly based on the selected Country and State.
       - Consider regional hiring trends.
       - Consider state-level tech hubs or industry clusters.
       - Adjust salary ranges according to the selected region.
    3. Consider:
       - Skill-demand gap
       - Salary expectation realism (based on selected location)
       - Industry growth trends (regional + global)
       - Automation and AI disruption risk
       - Entry-level feasibility
       - Required certifications
       - Competitive difficulty in that region
       - Long-term scalability (2026–2032)
    4. Avoid generic global-only answers.
    5. Ensure recommendations are realistic for the student's current year.
    6. Suggest careers achievable within 2–4 years.
    7. If salary expectations are unrealistic for the selected state/country, explain clearly and adjust recommendation accordingly.
    
    -----------------------------------
    OUTPUT FORMAT:
    -----------------------------------
    
    Generate TOP 5 career paths.
    
    Output strictly valid JSON with no additional text. The JSON structure must be:
    {
      "recommendations": [
        {
          "title": "Career Title",
          "matchScore": "Percentage (e.g., 95%)",
          "reason": "Detailed Reason for Match",
          "demand": "Current Market Demand (Location + Global)",
          "salary": {
            "entry": "Entry Level (0-2 years) Range",
            "mid": "Mid Level (3-5 years) Range"
          },
          "skills": ["Skill 1", "Skill 2"],
          "missingSkills": ["Missing Skill 1", "Missing Skill 2"],
          "certifications": ["Cert 1", "Cert 2"],
          "roadmap": ["Year 1: Step", "Year 2: Step"],
          "difficulty": "Low / Medium / High",
          "automationRisk": "Low / Medium / High",
          "futureOutlook": "Future Growth Outlook (2026-2032)",
          "projects": ["Project 1", "Project 2"]
        }
      ]
    }
    `;

  try {
    const completion = await groqRecommend.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful career assistant that outputs only JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    return JSON.parse(content);

  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to generate recommendations');
  }
};

export const getCareerDetails = async (careerTitle, userProfile) => {
  if (!API_KEY) {
    throw new Error('GROQ_API_KEY2 is not defined in environment variables');
  }

  const groqRecommend = new Groq({
    apiKey: API_KEY
  });

  const prompt = `
    You are an expert career counselor. Provide a comprehensive, detailed guide for the career path: "${careerTitle}".
    
    Context: The user is a student/professional with the following profile:
    - Branch: ${userProfile.branch || 'N/A'}
    - Domain Interest: ${userProfile.domain || 'N/A'}
    - Location: ${userProfile.location?.state || 'India'}, ${userProfile.location?.country || 'India'}

    Output strictly valid JSON with the following structure:
    {
      "overview": "Brief overview of the role (2-3 sentences)",
      "roleDescription": "Detailed description of what this role entails day-to-day",
      "keyResponsibilities": ["Resp 1", "Resp 2", "Resp 3", ...],
      "skills": {
        "required": ["Skill 1", "Skill 2", ...],
        "technical": ["Tech Skill 1", "Tech Skill 2", ...],
        "soft": ["Soft Skill 1", "Soft Skill 2", ...]
      },
      "educationalRequirements": "Degree, major, or background needed",
      "certifications": ["Cert 1", "Cert 2", ...],
      "scope": {
        "india": "Current scope and demand in India",
        "global": "Current scope and demand globally"
      },
      "industryDemand": "Analysis of current industry demand trend",
      "salary": {
        "fresher": "Expected range for freshers (INR/USD based on location)",
        "experienced": "Expected range for 3-5 years exp"
      },
      "topCompanies": ["Company 1", "Company 2", ...],
      "growthPath": ["Junior Role", "Mid-Level Role", "Senior Role", "Leadership Role"],
      "workEnvironment": "Description of typical work environment (remote/office, stress level, etc.)",
      "pros": ["Pro 1", "Pro 2", ...],
      "challenges": ["Challenge 1", "Challenge 2", ...],
      "futureTrends": "Emerging trends in this field (AI impact, etc.)",
      "suitability": "Who is this career right for? (Personality type, interests)"
    }
  `;

  try {
    const completion = await groqRecommend.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful career assistant that outputs only JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching career details:', error);
    throw new Error('Failed to fetch career details');
  }
};
