import React, { createContext, useState, useContext } from 'react';
import { login as loginService } from '../services/authService';
import { getUserProfile } from '../services/userService';
import { removeTokenAndEmail, getToken } from '../services/storageService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }
            const profileData = await getUserProfile();
            setUser(profileData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Contexto: Falha ao buscar dados do usuário", error);
            await logout();
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            await loginService(email, password);
            await fetchUserData();
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await removeTokenAndEmail();
        setUser(null);
        setIsAuthenticated(false);
    }
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