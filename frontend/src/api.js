import axios from 'axios';

// Dynamic API Base URL detection for Production & Local Development
const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // If running in browser on production domain (not localhost), use relative '/api'
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return '/api';
    }
    return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseURL();

const API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000
});

// Helper for image asset URLs in production vs local dev
export const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    let cleanImg = img.replace(/^\//, '');
    cleanImg = cleanImg.replace(/^uploads\//i, '').replace(/^picture\//i, '');
    const encodedImg = cleanImg.split('/').map(segment => encodeURIComponent(segment)).join('/');
    
    // In production or relative API mode, serve from relative /uploads
    if (API_BASE_URL.startsWith('/') || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
        return `/uploads/${encodedImg}`;
    }
    
    // In local dev, serve from backend server at port 5000
    const serverHost = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${serverHost}/uploads/${encodedImg}`;
};

// Add auth token & dynamic production URL check to every request
API.interceptors.request.use((config) => {
    // Dynamic runtime check: ensure deployed app never calls localhost
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        if (!config.baseURL || config.baseURL.includes('localhost:5000')) {
            config.baseURL = import.meta.env.VITE_API_URL || '/api';
        }
    }
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '' && !token.startsWith('kiskintha_')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;

