import React, { createContext, useState, useContext } from 'react';
import { login as loginService } from '../services/authService';
import { getUserProfile } from '../services/userService';
import { removeTokenAndEmail } from '../services/storageService';

// 1. Cria o Contexto
const UserContext = createContext();

// 2. Cria o Provedor do Contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUserData = async () => {
        try {
            const profileData = await getUserProfile();
            setUser(profileData);
            setIsAuthenticated(true);
            return profileData;
        } catch (error) {
            console.error("Contexto: Falha ao buscar dados do usuário", error);
            await logout();
            return null;
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            await loginService(email, password); 
            await fetchUserData(); 
            setIsLoading(false);
            return true;
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    const logout = async (navigation) => {
        await removeTokenAndEmail();
        setUser(null);
        setIsAuthenticated(false);
        if (navigation) {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        reloadUser: fetchUserData 
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    return useContext(UserContext);
};