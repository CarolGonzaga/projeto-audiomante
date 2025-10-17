"use client"; // Indica que este é um Componente de Cliente

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define a interface para os dados do usuário
interface User {
    id: string;
    email: string;
    username: string;
}

// Define a interface para o valor do contexto
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

// Cria o contexto com um valor padrão
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o componente Provedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Aqui, você poderia buscar os dados do usuário com a rota /me
            // para validar o token no carregamento da página.
            // Por simplicidade, vamos deixar para depois.
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        // Após o login, você buscaria os dados do usuário com a rota /me e os salvaria com setUser()
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};