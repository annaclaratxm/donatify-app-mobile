import api from './api';
import { getUserEmail } from './storageService';

/** Busca os dados do perfil do usuário logado. */
export const getUserProfile = async () => {
	try {
		// Primeiro tentamos buscar usando o endpoint /users/me
		try {
			const response = await api.get('/users/me');
			return response.data;
		} catch (meError) {
			// Se der erro, tentamos o método alternativo
			console.log('Erro ao usar /users/me, tentando método alternativo:', meError.response?.status);
		}

		// Método alternativo usando e-mail
		const email = await getUserEmail();
		if (!email) {
			throw new Error('E-mail do usuário não encontrado no armazenamento.');
		}

		const response = await api.get(`/users/email/${email}`);
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar perfil do usuário:', error.response || error);
		throw error;
	}
};

export const updateUserProfile = async (userData) => {
	try {
		const response = await api.patch('/users/me', userData);
		return response.data;
	} catch (error) {
		console.error('Erro ao atualizar perfil do usuário:', error.response || error);
		throw error;
	}
};