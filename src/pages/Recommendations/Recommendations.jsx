import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SiteNavbar from '../../shared/SiteNavbar';
import './Recommendations.css';

const Recommendations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false); // For Groq loading state
    const [view, setView] = useState('loading'); // 'loading', 'survey', 'results'
    const [formData, setFormData] = useState({
        branch: '',
        year: '',
        domain: '',
        salary: '',
        skills: '',
        experience: '',
        careerGoal: '',
        country: '',
        state: ''
    });
    const [recommendations, setRecommendations] = useState([]);
    const [selectedPath, setSelectedPath] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await axios.get('http://localhost:5000/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const user = response.data;

            // Check if survey is complete (using new fields as indicator)
            if (user.branch && user.domain && user.skills && user.location) {
                setFormData({
                    branch: user.branch || '',
                    year: user.year || '',
                    domain: user.domain || '',
                    salary: user.salary || '',
                    skills: user.skills || '',
                    experience: user.experience || '',
                    careerGoal: user.careerGoal || '',
                    country: user.location?.country || '',
                    state: user.location?.state || ''
                });
                fetchRecommendations(); // Auto-fetch if profile exists
            } else {
                // Pre-fill existing data even if incomplete
                setFormData(prev => ({
                    ...prev,
                    branch: user.branch || '',
                    year: user.year || '',
                    domain: user.domain || '',
                    salary: user.salary || '',
                    // new fields might be undefined initially
                    skills: user.skills || '',
                    experience: user.experience || '',
                    careerGoal: user.careerGoal || '',
                    country: user.location?.country || '',
                    state: user.location?.state || ''
                }));
                setView('survey');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setView('survey');
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        setAnalyzing(true);
        setView('results'); // Show loading state in results view
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/recommendations', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.recommendations) {
                setRecommendations(response.data.recommendations);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            // Optionally handle error state
        } finally {
            setAnalyzing(false);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSurveySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Construct payload matching authController expectation
            const payload = {
                ...formData,
                location: {
                    country: formData.country,
                    state: formData.state
                }
            };

            // Update profile first
            await axios.put('http://localhost:5000/auth/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Then fetch recommendations
            await fetchRecommendations();
        } catch (error) {
            console.error('Error submitting survey:', error);
            setLoading(false);
            alert('Failed to save survey. Please try again.');
        }
    };

    const handleRetakeSurvey = () => {
        setView('survey');
    };

    if (loading && view === 'loading') {
        return (
            <div className="recommendations-page">
                <SiteNavbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recommendations-page">
            <SiteNavbar />

            <div className="recommendations-container">
                {view === 'survey' ? (
                    <div className="survey-card">
                        <h1 className="survey-h1">Career Discovery Survey</h1>
                        <p className="survey-subtitle">Tell us about yourself to get personalized career paths.</p>

                        <form onSubmit={handleSurveySubmit}>
                            <div className="form-group-row">
                                <div className="form-group half">
                                    <label className="form-label">Current Branch / Major</label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="e.g. Computer Science"
                                        required
                                    />
                                </div>
                                <div className="form-group half">
                                    <label className="form-label">Year of Study</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Primary Domain Interest</label>
                                <input
                                    type="text"
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g. AI, Finance, Design"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Technical Skills (Comma separated)</label>
                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g. Java, Python, SQL, React"
                                    rows="2"
                                />
                            </div>

                            <div className="form-group-row">
                                <div className="form-group half">
                                    <label className="form-label">Experience Level</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label className="form-label">Expected Salary (INR)</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="e.g. 6,00,000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Career Goal</label>
                                <input
                                    type="text"
                                    name="careerGoal"
                                    value={formData.careerGoal}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g. Become a Solution Architect"
                                />
                            </div>

                            <div className="form-group-row">
                                <div className="form-group half">
                                    <label className="form-label">Preferred Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="e.g. India"
                                    />
                                </div>
                                <div className="form-group half">
                                    <label className="form-label">Preferred State/Region</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="e.g. Karnataka"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="submit-btn">
                                Find My Career Paths
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className="page-header">
                            <h1 className="page-title">Career Advice</h1>
                            <button onClick={handleRetakeSurvey} className="retake-btn">
                                ↺ Update Survey
                            </button>
                        </div>

                        {analyzing ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <h2>Analyzing your profile with AI...</h2>
                                <p>Evaluating skills, market trends, and location data...</p>
                            </div>
                        ) : (
                            <div className="recommendations-grid">
                                {recommendations.map((rec, index) => (
                                    <div key={index} className="rec-card" onClick={() => navigate(`/career-advice/${encodeURIComponent(rec.title)}`)}>
                                        <div className="rec-header">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 className="rec-title">{rec.title}</h3>
                                                <span className="match-score">{rec.matchScore} Match</span>
                                            </div>
                                            <div className="rec-salary">
                                                <span>💰</span> {rec.salary?.entry || rec.startingSalary} (Entry)
                                            </div>
                                        </div>
                                        <p className="rec-desc">{rec.reason || rec.description}</p>

                                        <div className="rec-meta">
                                            <span>📈 Demand: {rec.demand}</span>
                                        </div>

                                        <div className="rec-tags">
                                            {/* Show skills if available, else occupations */}
                                            {(rec.skills || rec.occupations || []).slice(0, 3).map((tag, idx) => (
                                                <span key={idx} className="rec-tag">{tag}</span>
                                            ))}
                                            {(rec.skills || rec.occupations || []).length > 3 && <span className="rec-tag">+{(rec.skills || rec.occupations).length - 3} more</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedPath && (
                    <div className="modal-overlay" onClick={() => setSelectedPath(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-btn" onClick={() => setSelectedPath(null)}>×</button>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h2 className="modal-h2">{selectedPath.title}</h2>
                                <span className="match-score large">{selectedPath.matchScore} Match</span>
                            </div>

                            <p className="rec-desc" style={{ fontSize: '1.1rem' }}>{selectedPath.reason || selectedPath.description}</p>

                            <div className="modal-grid">
                                <div>
                                    <div className="modal-section-title">💰 Salary Range (Location Based)</div>
                                    <ul className="modal-list">
                                        <li><strong>Entry Level:</strong> {selectedPath.salary?.entry}</li>
                                        <li><strong>Mid Level:</strong> {selectedPath.salary?.mid}</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="modal-section-title">📊 Market Demand</div>
                                    <p>{selectedPath.demand}</p>
                                    <p><strong>Difficulty:</strong> {selectedPath.difficulty} | <strong>Growth:</strong> {selectedPath.futureOutlook}</p>
                                </div>
                            </div>

                            <div className="modal-section-title">🛠️ Skills Analysis</div>
                            <div className="skill-section">
                                <p><strong>Required:</strong> {selectedPath.skills?.join(', ')}</p>
                                {selectedPath.missingSkills && selectedPath.missingSkills.length > 0 && (
                                    <p style={{ color: '#dc2626' }}><strong>To Learn:</strong> {selectedPath.missingSkills.join(', ')}</p>
                                )}
                            </div>

                            <div className="modal-section-title">🗺️ Roadmap (Year-wise)</div>
                            <ul className="modal-list">
                                {selectedPath.roadmap?.map((step, idx) => (
                                    <li key={idx}>📍 {step}</li>
                                ))}
                            </ul>

                            <div className="modal-section-title">🎓 Certifications & Projects</div>
                            <ul className="modal-list">
                                {selectedPath.certifications?.map((cert, idx) => (
                                    <li key={idx}>📜 {cert}</li>
                                ))}
                                {selectedPath.projects?.map((proj, idx) => (
                                    <li key={idx}>🚀 {proj}</li>
                                ))}
                            </ul>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
