import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SiteNavbar from '../../shared/SiteNavbar';
import './CareerDetail.css';

const CareerDetail = () => {
    const { careerTitle } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Decode title from URL
                const title = decodeURIComponent(careerTitle);

                const response = await axios.post('http://localhost:5000/api/recommendations/detail',
                    { title },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setDetails(response.data);
            } catch (err) {
                console.error('Error fetching details:', err);
                setError('Failed to load career details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [careerTitle, navigate]);

    if (loading) return (
        <div className="career-detail-page">
            <SiteNavbar />
            <div className="loading-container">
                <div className="spinner"></div>
                <h2>Gathering in-depth career insights...</h2>
                <p>Analyzing market trends, salary data, and skill requirements for {decodeURIComponent(careerTitle)}...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="career-detail-page">
            <SiteNavbar />
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/recommendations')} className="btn btn--primary">Back to Recommendations</button>
            </div>
        </div>
    );

    if (!details) return null;

    return (
        <div className="career-detail-page">
            <SiteNavbar />
            <div className="detail-container">
                <button onClick={() => navigate('/recommendations')} className="back-btn">← Back to Recommendations</button>

                <header className="detail-header">
                    <h1>{decodeURIComponent(careerTitle)}</h1>
                    <p className="detail-overview">{details.overview}</p>
                </header>

                <div className="detail-grid">
                    {/* Main Content */}
                    <div className="detail-main">
                        <section className="detail-section">
                            <h2>👨‍💻 Role Description</h2>
                            <p>{details.roleDescription}</p>
                        </section>

                        <section className="detail-section">
                            <h2>🔑 Key Responsibilities</h2>
                            <ul>
                                {details.keyResponsibilities?.map((item, idx) => <li key={idx}>{item}</li>)}
                            </ul>
                        </section>

                        <section className="detail-section">
                            <h2>🛠️ Skills Required</h2>
                            <div className="skills-grid">
                                <div>
                                    <h3>Technical</h3>
                                    <div className="tag-cloud">
                                        {details.skills?.technical?.map((s, i) => <span key={i} className="tag tag--tech">{s}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <h3>Soft Skills</h3>
                                    <div className="tag-cloud">
                                        {details.skills?.soft?.map((s, i) => <span key={i} className="tag tag--soft">{s}</span>)}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="detail-section">
                            <h2>📈 Career Scope & Demand</h2>
                            <div className="scope-box">
                                <p><strong>In India:</strong> {details.scope?.india}</p>
                                <p><strong>Globally:</strong> {details.scope?.global}</p>
                                <p className="trend-highlight"><strong>Industry Trend:</strong> {details.industryDemand}</p>
                            </div>
                        </section>

                        <section className="detail-section">
                            <h2>🚀 Growth Path</h2>
                            <div className="growth-path">
                                {details.growthPath?.map((step, idx) => (
                                    <div key={idx} className="growth-step">
                                        <div className="step-circle">{idx + 1}</div>
                                        <div className="step-label">{step}</div>
                                        {idx < details.growthPath.length - 1 && <div className="step-line"></div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="detail-sidebar">
                        <div className="sidebar-card salary-card">
                            <h3>💰 Salary Expectations</h3>
                            <div className="salary-item">
                                <span className="label">Entry Level (0-2 yrs)</span>
                                <span className="value">{details.salary?.fresher}</span>
                            </div>
                            <div className="salary-item">
                                <span className="label">Experienced (3-5 yrs)</span>
                                <span className="value">{details.salary?.experienced}</span>
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3>🎓 Requirements</h3>
                            <p><strong>Education:</strong> {details.educationalRequirements}</p>
                            <h4>Recommended Certifications:</h4>
                            <ul className="sidebar-list">
                                {details.certifications?.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </div>

                        <div className="sidebar-card">
                            <h3>🏢 Top Hiring Companies</h3>
                            <div className="company-tags">
                                {details.topCompanies?.map((c, i) => <span key={i} className="company-tag">{c}</span>)}
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3>⚖️ Pros & Challenges</h3>
                            <div className="pros-cons">
                                <h4>✅ Pros</h4>
                                <ul>{details.pros?.map((p, i) => <li key={i}>{p}</li>)}</ul>
                                <h4>⚠️ Challenges</h4>
                                <ul>{details.challenges?.map((c, i) => <li key={i}>{c}</li>)}</ul>
                            </div>
                        </div>

                        <div className="sidebar-card suitability-card">
                            <h3>🎯 Is this for you?</h3>
                            <p>{details.suitability}</p>
                        </div>

                        <div className="sidebar-card">
                            <h3>🔮 Future Trends</h3>
                            <p>{details.futureTrends}</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CareerDetail;
