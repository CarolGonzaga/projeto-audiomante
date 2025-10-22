"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    username: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Começa como true

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    // Valida o token e busca os dados do usuário
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Se o token for inválido, limpa tudo
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false); // Finaliza o carregamento
        };

        validateToken();
    }, []);

    const login = async (token: string) => {
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            logout(); // Se falhar ao buscar o usuário, desloga
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};