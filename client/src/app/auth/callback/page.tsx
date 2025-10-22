"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token); // Salva o token usando nosso AuthContext
            router.push('/'); // Redireciona para a home
        } else {
            router.push('/login?error=auth_failed'); // Se falhar, volta para o login
        }
    }, [searchParams, router, login]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Autenticando...</p>
        </div>
    );
}