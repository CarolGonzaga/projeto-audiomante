// client/src/app/signup/page.tsx
"use client";

import { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
                username,
                email,
                password,
            });

            // Redireciona para a página de login com uma mensagem de sucesso
            router.push('/login?status=success');

        } catch (err) {
            const axiosError = err as AxiosError<{ error: string }>;
            setError(axiosError.response?.data?.error || 'Erro ao criar a conta.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#2A233C]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#433A5E] rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#F3D1D7]">Criar Conta</h1>
                    <p className="text-gray-300 mt-2">Junte-se à comunidade Audiomante.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block">Nome de usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 mt-1 text-gray-200 bg-[#2A233C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E85972]"
                            required
                        />
                    </div>
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
                            Cadastrar
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-400">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-medium text-[#F3D1D7] hover:underline">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
}