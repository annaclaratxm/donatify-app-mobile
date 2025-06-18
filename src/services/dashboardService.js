import api from './api';

export const getDashboardData = async () => {
    try {
        const response = await api.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error.response || error);
        throw error;
    }
};