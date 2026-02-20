
/**
 * Scoring Engine for Career Recommendations
 * Implements weighted scoring, intent detection, and eligibility filtering.
 */

// Weights
const WEIGHTS = {
    GOAL: 0.30,
    DOMAIN: 0.25,
    SKILL: 0.20,
    BRANCH: 0.15,
    SALARY: 0.05,
    LOCATION: 0.05
};

// Intent Boosting Keywords Mapping
const INTENT_KEYWORDS = {
    "pilot": ["Pilot", "Aviation", "Commercial Pilot"],
    "airline": ["Cabin Crew", "Airport Manager", "Aviation"],
    "banking": ["Investment Banker", "Bank PO", "Financial Analyst"],
    "investment": ["Investment Banker", "Financial Analyst", "Stock Broker"],
    "software": ["Software Engineer", "Developer", "Full Stack", "Data Scientist"],
    "developer": ["Software Engineer", "Developer", "Web Developer"],
    "ai": ["AI Engineer", "Data Scientist", "Machine Learning"],
    "data": ["Data Scientist", "Data Analyst", "Big Data"],
    "design": ["Graphic Designer", "UI/UX Designer", "Fashion Designer"],
    "management": ["Management Consultant", "Product Manager", "MBA"],
    "teaching": ["Professor", "Teacher", "Lecturer"],
    "law": ["Lawyer", "Judge", "Legal Advisor"],
    "upsc": ["IAS", "IPS", "IFS", "Civil Services"],
    "government": ["Civil Services", "SSC", "Bank PO"]
};

/**
 * Cleanup and normalize strings for comparison
 */
const normalize = (str) => str ? str.toLowerCase().trim() : "";

/**
 * Calculate match score for a single career against user profile
 */
export const calculateScore = (user, career) => {
    let score = 0;
    let log = {}; // For debugging/explanation

    // 1. Goal Match (0.30)
    // fuzzy match user.careerGoal with career.title
    const goal = normalize(user.careerGoal);
    const title = normalize(career.title);
    let goalScore = 0;
    if (goal && title.includes(goal) || goal.includes(title)) {
        goalScore = 100;
    } else {
        // Check keywords
        const goalWords = goal.split(/\s+/);
        const matches = goalWords.filter(w => title.includes(w) && w.length > 3);
        if (matches.length > 0) goalScore = 50 + (matches.length * 10);
    }
    score += Math.min(goalScore, 100) * WEIGHTS.GOAL;
    log.goal = { score: goalScore, weight: WEIGHTS.GOAL };

    // 2. Domain Match (0.25)
    let domainScore = 0;
    const userDomain = normalize(user.domain);
    const careerDomain = normalize(career.domain || career.category || "");
    if (userDomain && careerDomain) {
        if (careerDomain.includes(userDomain) || userDomain.includes(careerDomain)) {
            domainScore = 100;
        } else if ((career.title || "").toLowerCase().includes(userDomain)) { // fallback if domain is in title
            domainScore = 80;
        }
    }
    score += domainScore * WEIGHTS.DOMAIN;
    log.domain = { score: domainScore, weight: WEIGHTS.DOMAIN };

    // 3. Skill Match (0.20)
    let skillScore = 0;
    const userSkills = (user.skills || "").split(',').map(s => normalize(s));
    const careerSkills = Array.isArray(career.skills) ?
        career.skills.map(s => normalize(s)) :
        (typeof career.skills === 'string' ? career.skills.split(';').map(s => normalize(s)) : []);

    if (userSkills.length > 0 && careerSkills.length > 0) {
        const matches = userSkills.filter(s => careerSkills.some(cs => cs.includes(s) || s.includes(cs)));
        skillScore = (matches.length / Math.max(careerSkills.length, 5)) * 100; // Normalise
        // Boost for exact matches
        if (matches.length >= 3) skillScore += 20;
    }
    score += Math.min(skillScore, 100) * WEIGHTS.SKILL;
    log.skill = { score: skillScore, weight: WEIGHTS.SKILL };

    // 4. Branch Match (0.15)
    let branchScore = 0;
    const userBranch = normalize(user.branch);
    const eligibility = normalize(career.eligibility || career.degree_required || "");

    // Simple heuristic for branch matching
    if (userBranch && eligibility) {
        if (eligibility.includes(userBranch) || userBranch.includes(eligibility)) {
            branchScore = 100;
        } else if (eligibility.includes("any") || eligibility.includes("12th") || eligibility.includes("graduation")) {
            // General eligibility
            branchScore = 60;
            // Boost if user branch corresponds to career domain roughly
            if (userBranch.includes("computer") && normalize(career.title).includes("software")) branchScore = 90;
            if (userBranch.includes("commerce") && normalize(career.title).includes("accountant")) branchScore = 90;
            if (userBranch.includes("arts") && normalize(career.title).includes("design")) branchScore = 90;
        } else {
            branchScore = 20; // Low match
        }
    } else {
        branchScore = 50; // Neutral if unknown
    }
    score += branchScore * WEIGHTS.BRANCH;
    log.branch = { score: branchScore, weight: WEIGHTS.BRANCH };

    // 5. Salary Match (0.05)
    // Only basic check: if user expects X, and career offers > X
    let salaryScore = 50;
    const userSalary = parseInt(String(user.salary || "0").replace(/[^0-9]/g, ''));
    // Attempt parse career salary "5 - 8 LPA"
    let careerSalaryStr = "";
    if (career.salary && typeof career.salary === 'object') careerSalaryStr = career.salary.entry || career.salary.entry_level || "";
    else careerSalaryStr = String(career.salary || "");

    const salaryMatches = careerSalaryStr.match(/(\d+)/);
    if (userSalary > 0 && salaryMatches) {
        const salaryLPA = parseInt(salaryMatches[0]); // assume LPA if small number, or direct
        const userLPA = userSalary < 100 ? userSalary : userSalary / 100000; // normalize to LPA estimate

        if (salaryLPA >= userLPA) salaryScore = 100;
        else if (salaryLPA >= userLPA * 0.7) salaryScore = 70;
        else salaryScore = 30;
    }
    score += salaryScore * WEIGHTS.SALARY;

    // 6. Location Match (0.05)
    // Placeholder as data is limited. Assume India context implies match.
    // If user prefers "India" and career scope is "India", good.
    let locationScore = 80;
    score += locationScore * WEIGHTS.LOCATION;

    // --- BOOSTING ---
    let boost = 0;

    // Goal Intent Boosting
    if (goal) {
        for (const [key, roles] of Object.entries(INTENT_KEYWORDS)) {
            if (goal.includes(key)) {
                if (roles.some(r => title.includes(normalize(r)))) {
                    boost += 25;
                    log.boostReason = "Goal Intent Keyword Match: " + key;
                }
            }
        }
    }

    // --- FILTERING / PENALTIES ---
    let penalty = 0;
    // Engineering check
    if (eligibility.includes("b.tech") || eligibility.includes("engineering")) {
        if (!userBranch.includes("tech") && !userBranch.includes("eng") && !userBranch.includes("computer")) {
            if (normalize(user.year) !== "1st year") { // allow 1st years some leeway
                penalty += 50;
                log.penaltyReason = "Engineering degree required";
            }
        }
    }

    // Final Calculation
    const finalScore = Math.max(0, Math.min(100, score + boost - penalty));

    return {
        score: finalScore,
        details: log,
        raw_score: score,
        boost: boost,
        penalty: penalty
    };
};

/**
 * Classify career into types
 */
export const classifyCareer = (result, user) => {
    // Dream: High Goal Match > 80
    // Safe: High Skill Match > 80
    // Alternative: High Branch Match > 80

    const { details } = result;
    if (details.goal.score >= 80) return "Dream Career";
    if (details.skill.score >= 80) return "Safe Career";
    if (details.branch.score >= 80) return "Alternative Career";
    return "Recommended";
};
