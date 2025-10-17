"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth'; // Importa nosso novo hook

export default function HomePage() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#2A233C] text-white">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-[#F3D1D7] mb-4">
                    Bem-vinda ao Audiomante!
                </h1>

                {isAuthenticated ? (
                    // Conteúdo para usuários LOGADOS
                    <div className="space-y-4">
                        <p className="text-lg text-gray-300">
                            Sua estante está pronta. Comece a adicionar seus livros!
                        </p>
                        <button
                            onClick={logout}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md transition duration-300"
                        >
                            Sair (Logout)
                        </button>
                    </div>
                ) : (
                    // Conteúdo para VISITANTES
                    <div className="space-y-4">
                        <p className="text-lg text-gray-300">
                            Faça login para acessar sua estante de livros sáficos.
                        </p>
                        {/* ESTE É O LINK CORRIGIDO */}
                        <Link
                            href="/login"
                            className="px-6 py-2 bg-[#E85972] hover:bg-[#d94862] text-white font-bold rounded-md transition duration-300 inline-block"
                        >
                            Ir para Login
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}