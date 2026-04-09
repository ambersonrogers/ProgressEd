import axios from 'axios';

// Usa a variável de ambiente do Vite, com fallback para localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔌 API URL configurada:', API_URL);

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;