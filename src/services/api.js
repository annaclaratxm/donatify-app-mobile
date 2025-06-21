import axios from 'axios';
import { getToken } from './storageService';

const BASE_URL = 'https://donatify-api-205718923595.southamerica-east1.run.app/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('API Base URL:', BASE_URL);

api.interceptors.request.use(async (config) => {
    try {
        const token = await getToken();
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`[API] Requisição para ${config.url} com token`);
        } else {
            console.log(`[API] Requisição para ${config.url} sem token`);
        }
    } catch (error) {
        console.error('[API] Erro ao obter token:', error);
    }
    
    return config;
}, (error) => {
    console.error('[API] Erro na requisição:', error);
    return Promise.reject(error);
});

// Adicionando interceptor para tratar erros de resposta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            
            // Log para debug
            console.log(`[API] Erro ${status} em ${error.config.url}`);
            
            // Tratamento específico para erro de autenticação
            if (status === 401) {
                console.warn('[API] Erro de autenticação - Token inválido ou expirado');
                // Aqui você pode adicionar lógica para redirecionar para login
                // ou atualizar o token se tiver um refresh token disponível
            }
        } else if (error.request) {
            console.error('[API] Sem resposta do servidor:', error.request);
        } else {
            console.error('[API] Erro na configuração da requisição:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default api;