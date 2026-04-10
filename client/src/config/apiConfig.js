// Centralized API configuration for production and development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
console.log("DEBUG: API_BASE_URL resolved to:", API_BASE_URL);

export default API_BASE_URL;
