import axios from 'axios';

const REMOTE_API_URL = 'https://progress-ed.vercel.app/api';

// Detecta automaticamente se está rodando na Vercel (mesmo domínio) ou localmente
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // Na Vercel ou em produção web, sempre usar caminho relativo /api
        if (hostname.includes('vercel.app') || (hostname !== 'localhost' && hostname !== '127.0.0.1')) {
            return '/api';
        }
    }
    if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('onrender')) {
        return import.meta.env.VITE_API_URL;
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
            typeof window !== 'undefined'
        ) {
            config._retry = true;
            const target = window.location.hostname.includes('vercel.app') ? '/api' : REMOTE_API_URL;
            config.baseURL = target;
            console.warn('[ProgressEd] Erro de conexão com backend local. Redirecionando requisição para:', target);
            return axios(config);
        }
        return Promise.reject(error);
    }
);

export default api;