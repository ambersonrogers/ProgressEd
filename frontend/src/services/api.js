import axios from 'axios';

const REMOTE_API_URL = 'https://progress-ed-git-master-ambersonrogers-projects.vercel.app/api';

// Detecta automaticamente se está rodando na Vercel (mesmo domínio) ou localmente
const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('vercel.app') || window.location.port === '' || (hostname !== 'localhost' && hostname !== '127.0.0.1')) {
            return '/api';
        }
    }
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 15000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de resposta: Se o backend local não estiver rodando (Network Error), faz fallback para a Vercel
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (
            (!error.response || error.code === 'ERR_NETWORK') &&
            config &&
            !config._retry &&
            typeof window !== 'undefined' &&
            config.baseURL &&
            config.baseURL.includes('localhost:5000')
        ) {
            config._retry = true;
            config.baseURL = REMOTE_API_URL;
            console.warn('[ProgressEd] Backend local indisponível, alternando automaticamente para API Remota Neon/Vercel:', REMOTE_API_URL);
            return axios(config);
        }
        return Promise.reject(error);
    }
);

export default api;