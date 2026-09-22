import axios from 'axios';

// Dynamic API Base URL detection for Production & Local Development
const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Default to relative '/api' so Vite dev proxy and production work seamlessly with zero CORS issues
    return '/api';
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
    return `/uploads/${encodedImg}`;
};

// Add auth token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '' && !token.startsWith('kiskintha_')) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Force fresh live data for all GET requests using timestamp param without triggering CORS preflights
    if (config.method === 'get' || !config.method) {
        config.params = config.params || {};
        config.params._t = Date.now();
    }

    return config;
});

export default API;

