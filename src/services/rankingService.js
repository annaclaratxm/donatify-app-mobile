import api from './api';

/** Busca a lista do ranking de usuários da API. */
export const getRankingList = async () => {
    try {
        const response = await api.get('/ranking');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lista do ranking:', error.response || error);
        throw error;
    }
};