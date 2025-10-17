"use client";

import { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                email,
                password,
            });

            login(response.data.token);
            router.push('/');

        } catch (err) {
            const axiosError = err as AxiosError<{ error: string }>;
            setError(axiosError.response?.data?.error || 'Erro ao fazer login.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#2A233C]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#433A5E] rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#F3D1D7]">Audiomante</h1>
                    <p className="text-gray-300 mt-2">Sua estante de livros sáficos.</p>
                </div>

                <a
                    href="http://localhost:3001/auth/google"
                    className="w-full py-2 px-4 border border-gray-500 text-white font-bold rounded-md transition duration-300 flex items-center justify-center gap-2 hover:bg-gray-700"
                >
                    Entrar com o Google
                </a>

                <div className="my-4 text-center text-gray-400">ou</div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mt-1 text-gray-200 bg-[#2A233C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E85972]"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mt-1 text-gray-200 bg-[#2A233C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E85972]"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#E85972] hover:bg-[#d94862] text-white font-bold rounded-md transition duration-300"
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Não tem uma conta?{' '}
                    <Link href="/signup" className="font-medium text-[#F3D1D7] hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}