"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
    const { isAuthenticated, logout, loading } = useAuth();

    return (
        <nav className="bg-[#1E192B] p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-[#F3D1D7]">
                    Audiomante
                </Link>

                {/* Não mostra os links enquanto estiver verificando a autenticação */}
                {!loading && (
                    <div className="space-x-4">
                        {isAuthenticated ? (
                            // Links para usuários logados
                            <>
                                <Link href="/bookshelf" className="text-gray-300 hover:text-white">
                                    Minha Estante
                                </Link>
                                <Link href="/search" className="text-gray-300 hover:text-white">
                                    Buscar Livros
                                </Link>
                                <button onClick={logout} className="text-gray-300 hover:text-white">
                                    Sair
                                </button>
                            </>
                        ) : (
                            // Links para visitantes
                            <Link href="/login" className="text-gray-300 hover:text-white">
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}