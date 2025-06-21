import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService } from '../services/authService';
import { getUserProfile } from '../services/userService';
import { removeTokenAndEmail, getToken } from '../services/storageService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Inicialmente true para mostrar o loading
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verificar autenticação ao inicializar
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await fetchUserData();
            } catch (error) {
                console.error("Falha ao verificar autenticação:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }
            
            console.log("[UserContext] Token encontrado, buscando perfil do usuário");
            
            try {
                const profileData = await getUserProfile();
                console.log("[UserContext] Perfil do usuário carregado com sucesso");
                setUser(profileData);
                setIsAuthenticated(true);
            } catch (profileError) {
                console.error("[UserContext] Erro ao buscar perfil, possível token inválido:", profileError.response?.status);
                
                // Se o erro for de autenticação (401) ou autorização (403), fazemos logout
                if (profileError.response && (profileError.response.status === 401 || profileError.response.status === 403)) {
                    console.warn("[UserContext] Token inválido, realizando logout");
                    await logout();
                }
            }
        } catch (error) {
            console.error("[UserContext] Falha ao buscar dados do usuário:", error);
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