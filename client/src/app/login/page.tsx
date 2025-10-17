"use client";

import { useState, FormEvent, useContext } from 'react'; // 1. Importe o useContext
import axios, { AxiosError } from 'axios'; // 2. Importe o AxiosError
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext'; // 3. Importe o AuthContext

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const authContext = useContext(AuthContext); // 4. Pegue o contexto

    if (!authContext) {
        // Isso garante que o contexto está disponível
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { login } = authContext; // 5. Pegue a função de login do contexto

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
                { email, password }
            );

            // 6. Use a função de login do contexto para salvar o token
            login(response.data.token);

            // Redireciona para a página principal após o login
            router.push('/');

        } catch (err) {
            // 7. Use o tipo AxiosError para tratar o erro de forma segura
            const axiosError = err as AxiosError<{ error: string }>;
            setError(axiosError.response?.data?.error || 'Erro ao fazer login.');
        }
    };

    // ... (o resto do seu código JSX do formulário permanece o mesmo)
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#2A233C]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#433A5E] rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#F3D1D7]">Audiomante</h1>
                    <p className="text-gray-300 mt-2">Sua estante de livros sáficos.</p>
                </div>
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
            </div>
        </div>
    );
}