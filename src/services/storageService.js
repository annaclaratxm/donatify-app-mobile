import AsyncStorage from '@react-native-async-storage/async-storage';

// Salva o token de acesso no armazenamento
export const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (e) {
        console.error('Falha ao salvar o token', e);
    }
};

// Recupera o token de acesso do armazenamento
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('userToken');
    } catch (e) {
        console.error('Falha ao buscar o token', e);
        return null;
    }
};

// Salva o e-mail do usuário no armazenamento
export const storeUserEmail = async (email) => {
    try {
        await AsyncStorage.setItem('userEmail', email);
    } catch (e) {
        console.error('Falha ao salvar o e-mail', e);
    }
};

// Recupera o e-mail do usuário do armazenamento
export const getUserEmail = async () => {
    try {
        return await AsyncStorage.getItem('userEmail');
    } catch (e) {
        console.error('Falha ao buscar o e-mail', e);
        return null;
    }
};

// Remove o token e o e-mail (usado no logout)
export const removeTokenAndEmail = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userEmail');
    } catch (e) {
        console.error('Falha ao remover o token e e-mail', e);
    }
};