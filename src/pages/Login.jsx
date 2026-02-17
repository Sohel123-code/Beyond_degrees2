import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/auth';
import '../styles.css';

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (!validateEmail(email)) {
            setError('Please enter a valid Gmail address (ending in @gmail.com)');
            setLoading(false);
            return;
        }

        try {
            let res;
            if (isSignup) {
                res = await register(name, email, password);
                setMessage('Registration successful! Redirecting...');
            } else {
                res = await login(email, password);
                setMessage('Login successful! Redirecting...');
            }

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
        setMessage('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="login-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#ffffff', // White background as requested
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div className="login-box" style={{
                background: '#ffffff',
                padding: '3rem',
                borderRadius: '16px',
                border: '1px solid #eee', // Adding subtle border since bg is white
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
            }}>
                <h2 style={{ marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
                    {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{ marginBottom: '2rem', color: '#666' }}>
                    {isSignup ? 'Sign up to get started' : 'Login to access modules'}
                </p>

                {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
                {error && <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontSize: '0.95rem', fontWeight: '600' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    backgroundColor: '#f9f9f9'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontSize: '0.95rem', fontWeight: '600' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                outline: 'none',
                                backgroundColor: '#f9f9f9'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontSize: '0.95rem', fontWeight: '600' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                outline: 'none',
                                backgroundColor: '#f9f9f9'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: '#333', // Dark ergonomic button
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            opacity: loading ? 0.8 : 1,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {loading ? 'Processing...' : (isSignup ? 'Register' : 'Login')}
                    </button>

                    <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                        {isSignup ? 'Already have an account?' : 'New here?'}
                        <span
                            onClick={toggleMode}
                            style={{
                                color: '#333',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginLeft: '5px',
                                textDecoration: 'underline'
                            }}
                        >
                            {isSignup ? 'Login' : 'Create an account'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
