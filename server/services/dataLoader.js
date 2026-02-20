
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../src/data');

// Helper to normalized field access
const transformCareer = (raw, sourceFile) => {
    // Handle different structures
    let title = raw.career_name || raw.title || raw.name || "Unknown";
    let skills = raw.skills_required || raw.skills || [];
    let salary = raw.salary_in_india || raw.salary_range_inr || raw.entry_salary || raw.salary || {};
    let overview = Array.isArray(raw.overview) ? raw.overview[0] : (raw.overview || "");
    let eligibility = raw.eligibility || raw.degree_required || "";

    // Infer domain from source file
    let domain = raw.category || raw.domain || "";
    if (!domain) {
        if (sourceFile.includes("commerce")) domain = "Commerce & Finance";
        if (sourceFile.includes("science")) domain = "Science & Tech";
        if (sourceFile.includes("arts")) domain = "Arts & Humanities";
        if (sourceFile.includes("software")) domain = "Software & IT";
    }

    return {
        title,
        skills, // Array or string
        salary, // Object or string
        overview,
        eligibility,
        domain,
        source: 'local_json',
        original: raw
    };
};

export const loadAllCareers = async () => {
    const files = ['commerce.json', 'science.json', 'arts.json', 'non_degree.json', 'offbeat.json', 'buisness.json'];
    let allCareers = [];

    for (const file of files) {
        try {
            const filePath = path.join(DATA_DIR, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const json = JSON.parse(content);

            let list = [];
            // Extract array based on file structure
            if (Array.isArray(json)) {
                list = json;
            } else if (json.careers) {
                list = json.careers;
            } else if (json.arts_students_careers) {
                list = json.arts_students_careers;
            } else if (json.business_careers) {
                list = json.business_careers;
            } else {
                // Try finding the first array property
                const values = Object.values(json);
                const arrayVal = values.find(v => Array.isArray(v));
                if (arrayVal) list = arrayVal;
            }

            const normalized = list.map(item => transformCareer(item, file));
            allCareers = [...allCareers, ...normalized];

        } catch (err) {
            console.error(`Error loading ${file}:`, err.message);
            // Continue with other files
        }
    }
    return allCareers;
};

// Also export a helper to merge software DB roles
export const mergeSoftwareRoles = (softwareRoles) => {
    return softwareRoles.map(role => ({
        title: role.Title,
        skills: role.Skills, // String "C#; Java"
        salary: { entry: "4-8 LPA" }, // Estimate or placeholder
        overview: role.Responsibilities,
        eligibility: role.YearsOfExperience === 'Fresher' ? "Any Degree" : "Experience Required", // Simple heuristic
        domain: "Software & IT",
        source: 'db_software',
        original: role
    }));
};
