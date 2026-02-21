import axios from 'axios';

const API_URL = '/auth';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.user) {
                localStorage.setItem('user_id', response.data.user.id);
                localStorage.setItem('user_name', response.data.user.user_name || 'User');
                localStorage.setItem('user_email', response.data.user.email);
                if (response.data.user.image) {
                    localStorage.setItem('user_photo', response.data.user.image);
                } else {
                    localStorage.removeItem('user_photo');
                }
            }
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Login failed';
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.user) {
                localStorage.setItem('user_id', response.data.user.id);
                localStorage.setItem('user_name', response.data.user.user_name || name);
                localStorage.setItem('user_email', response.data.user.email);
                if (response.data.user.image) {
                    localStorage.setItem('user_photo', response.data.user.image);
                } else {
                    localStorage.removeItem('user_photo');
                }
            }
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Registration failed';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_photo');
    // Use window.location.href safely or navigate if available in context
    window.location.href = '/login';
};
