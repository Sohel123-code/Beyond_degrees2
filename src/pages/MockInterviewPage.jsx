import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import gsap from 'gsap';
import { supabase } from '../config/supabaseClient';
import SiteNavbar from '../shared/SiteNavbar';
import useAnimations from '../hooks/useAnimations';
import './MockInterviewPage.css';

const MockInterviewPage = () => {
    const navigate = useNavigate();
    const { initAnimations } = useAnimations();
    const [step, setStep] = useState('selection'); // selection, loading, interview, results
    const [branches, setBranches] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(45);
    const [isLoading, setIsLoading] = useState(false);
    const [score, setScore] = useState(0);

    const containerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchRolesAndBranches();
    }, []);

    useEffect(() => {
        // Re-scan for reveal elements whenever step changes
        initAnimations();
    }, [step, initAnimations]);

    const fetchRolesAndBranches = async () => {
        try {
            const { data, error } = await supabase
                .from('roles')
                .select('Branch, Role');

            if (error) throw error;

            const uniqueBranches = [...new Set(data.map(item => item.Branch))].sort();
            setBranches(uniqueBranches);
            setAllRoles(data);
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    const startInterview = async () => {
        if (!selectedRole) return;
        setStep('loading');
        window.scrollTo(0, 0);

        try {
            const response = await axios.post('/api/interview/generate', { role: selectedRole });
            setQuestions(response.data.questions);
            setStep('interview');
            setCurrentQuestionIndex(0);
            setAnswers({});
            setTimer(45);
        } catch (error) {
            console.error('Error starting interview:', error);
            alert('Failed to generate questions. Please try again.');
            setStep('selection');
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            gsap.to('.question-card', {
                opacity: 0,
                x: -30,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setTimer(45);
                    gsap.fromTo('.question-card',
                        { opacity: 0, x: 30 },
                        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
                    );
                }
            });
        } else {
            calculateResults();
        }
    };

    const calculateResults = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setStep('results');
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        if (step === 'interview' && timer > 0) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && step === 'interview') {
            handleNext();
        }
        return () => clearInterval(timerRef.current);
    }, [step, timer]);

    const filteredRoles = allRoles.filter(item => {
        const matchesBranch = selectedBranch ? item.Branch === selectedBranch : true;
        const matchesSearch = item.Role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBranch && matchesSearch;
    });

    return (
        <div className="interview-page">
            <SiteNavbar />

            <div className="interview-container container" ref={containerRef}>
                {step === 'selection' && (
                    <div className="selection-view reveal">
                        <h1 className="view-title">Interview Preparation</h1>
                        <p className="view-subtitle">Select your branch and role to begin a custom AI-powered mock interview.</p>

                        <div className="selection-grid">
                            <div className="branch-selector">
                                <h3>1. Select Branch</h3>
                                <div className="branch-list">
                                    <div
                                        className={`branch-item ${!selectedBranch ? 'active' : ''}`}
                                        onClick={() => { setSelectedBranch(''); setSelectedRole(''); }}
                                    >
                                        All Branches
                                    </div>
                                    {branches.map(branch => (
                                        <div
                                            key={branch}
                                            className={`branch-item ${selectedBranch === branch ? 'active' : ''}`}
                                            onClick={() => { setSelectedBranch(branch); setSelectedRole(''); }}
                                        >
                                            {branch.replace(/_/g, ' ')}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="role-selector">
                                <h3>2. Select Role</h3>
                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Search roles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <span className="search-icon">🔍</span>
                                </div>
                                <div className="role-list">
                                    {filteredRoles.length > 0 ? (
                                        filteredRoles.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`role-item ${selectedRole === item.Role ? 'active' : ''}`}
                                                onClick={() => setSelectedRole(item.Role)}
                                            >
                                                {item.Role}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-roles">No roles found matching your search.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="selection-footer">
                            <button
                                className={`main-start-btn ${!selectedRole ? 'disabled' : ''}`}
                                disabled={!selectedRole}
                                onClick={startInterview}
                            >
                                Start Preparation {selectedRole && `for ${selectedRole}`}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'loading' && (
                    <div className="loading-view">
                        <div className="ai-loader">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>
                        <h2>Generating Question Blueprint...</h2>
                        <p>Our AI is analyzing the requirements for <strong>{selectedRole}</strong>.</p>
                    </div>
                )}

                {step === 'interview' && questions[currentQuestionIndex] && (
                    <div className="interview-view">
                        <div className="interview-nav">
                            <div className="progress-info">
                                <div className="progress-text">
                                    <span>Progress</span>
                                    <span>{currentQuestionIndex + 1} / {questions.length}</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className={`timer-box ${timer < 10 ? 'timer-urgent' : ''}`}>
                                <span className="timer-label">Time Remaining</span>
                                <span className="timer-value">{timer}s</span>
                            </div>
                        </div>

                        <div className="question-card">
                            <div className="question-tag">Question {currentQuestionIndex + 1}</div>
                            <h2 className="question-text">{questions[currentQuestionIndex].question}</h2>

                            <div className="options-stack">
                                {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                                    <button
                                        key={key}
                                        className={`option-box ${answers[currentQuestionIndex] === key ? 'selected' : ''}`}
                                        onClick={() => setAnswers({ ...answers, [currentQuestionIndex]: key })}
                                    >
                                        <span className="key-circle">{key}</span>
                                        <span className="value-text">{value}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="interview-actions">
                            <button
                                className="action-next-btn"
                                onClick={handleNext}
                                disabled={!answers[currentQuestionIndex]}
                            >
                                {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'results' && (
                    <div className="results-view reveal">
                        <div className="results-summary">
                            <h1 className="reveal">Performance Report</h1>

                            <div className="results-main-grid">
                                <div className="final-score-box reveal">
                                    <div className="score-percent">
                                        {Math.round((score / questions.length) * 100)}%
                                    </div>
                                    <div className="score-detail">
                                        Overall Score: {score} / {questions.length}
                                    </div>
                                </div>

                                <div className="stats-breakdown reveal">
                                    <h3>Competency Breakdown</h3>
                                    <div className="stats-list">
                                        {Object.entries(
                                            questions.reduce((acc, q, idx) => {
                                                const cat = q.category || 'General';
                                                if (!acc[cat]) acc[cat] = { total: 0, correct: 0 };
                                                acc[cat].total++;
                                                if (answers[idx] === q.correctAnswer) acc[cat].correct++;
                                                return acc;
                                            }, {})
                                        ).map(([cat, stat]) => (
                                            <div key={cat} className="stat-row">
                                                <span className="stat-label">{cat}</span>
                                                <div className="stat-bar-container">
                                                    <div className="stat-bar-fill" style={{ width: `${(stat.correct / stat.total) * 100}%` }}></div>
                                                </div>
                                                <span className="stat-value">{stat.correct}/{stat.total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="summary-text reveal">
                                {score === questions.length ? "Incredible! You're fully prepared for this role. You displayed mastery across all dimensions." :
                                    score >= (questions.length * 0.7) ? "Great job! You have a solid grasp of the concepts and are well on your way." :
                                        "Good effort. Focus on the analysis below to strengthen your specific weak areas."}
                            </p>
                        </div>

                        <div className="review-list">
                            <h2 className="review-title">Detailed Performance Review</h2>
                            {questions.map((q, idx) => {
                                const categoryIcons = {
                                    'Concept': '📚',
                                    'Scenario': '💡',
                                    'Code logic': '⚙️',
                                    'Technical logic': '⚙️',
                                    'Behavioral': '👤',
                                    'Aptitude': '🧠'
                                };
                                const icon = categoryIcons[q.category] || '❓';

                                return (
                                    <div key={idx} className={`review-card ${answers[idx] === q.correctAnswer ? 'pass' : 'fail'}`}>
                                        <div className="review-header">
                                            <div className="category-pill">
                                                <span className="cat-icon">{icon}</span>
                                                <span className="cat-name">{q.category || 'General'}</span>
                                            </div>
                                            <span className="review-status">
                                                {answers[idx] === q.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                                            </span>
                                        </div>
                                        <p className="review-question">{q.question}</p>
                                        <div className="review-answers">
                                            <div className="answer-item">
                                                <strong>Your Choice:</strong>
                                                <span className={answers[idx] === q.correctAnswer ? 'text-pass' : 'text-fail'}>
                                                    {answers[idx] ? `${answers[idx]} - ${q.options[answers[idx]]}` : 'Skipped'}
                                                </span>
                                            </div>
                                            {answers[idx] !== q.correctAnswer && (
                                                <div className="answer-item">
                                                    <strong>Correct Answer:</strong>
                                                    <span className="text-pass">{q.correctAnswer} - {q.options[q.correctAnswer]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="explanation-box">
                                            <div className="exp-label">Analysis & Explanation</div>
                                            {q.explanation}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="results-footer">
                            <button className="restart-btn" onClick={() => setStep('selection')}>
                                Restart with New Role
                            </button>
                            <button className="home-btn" onClick={() => navigate('/')}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockInterviewPage;
