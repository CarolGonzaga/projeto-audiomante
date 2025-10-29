// /client/src/components/Navbar/index.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
    const { isAuthenticated, logout, loading, user } = useAuth();

    return (
        <nav className="bg-[#4f3d6b] p-3 shadow-md sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/audiomante.png" // Usar a imagem PNG 
                        alt="Audiomante Logo"
                        width={218} // Largura original para proporção
                        height={53}  // Altura original para proporção
                        className="h-8 w-auto md:h-10" // Controla o tamanho exibido
                    />
                    {/* Texto "Audiomante" removido daqui */}
                    {/*
                    <span className="text-xl md:text-2xl font-bold text-[#F3D1D7] font-display hidden sm:block">
                        Audiomante
                    </span>
                    */}
                </Link>

                {/* Barra de Busca (centralizada) */}
                {!loading && isAuthenticated && (
                    <div className="relative flex-grow max-w-lg mx-4 hidden md:block">
                        <input
                            type="search"
                            placeholder="Busque por título, autor, editora..."
                            className="w-full p-2 pl-10 rounded-md bg-white/90 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85972]"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                )}

                {/* Seção do Usuário */}
                {!loading && (
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                {/* Ícone e Nome */}
                                <div className="flex items-center gap-2">
                                    <FaUserCircle className="text-gray-300 h-6 w-6 md:h-7 md:h-7" />
                                    <span className="text-sm text-gray-200 hidden lg:block">
                                        Olá, {user.username.split(' ')[0]}!
                                    </span>
                                </div>
                                {/* Botão Sair com margem e cursor */}
                                <button
                                    onClick={logout}
                                    className="text-gray-300 hover:text-white ml-4 cursor-pointer" // Adicionado ml-4 e cursor-pointer
                                    title="Sair"
                                >
                                    <FaSignOutAlt className="h-5 w-5 md:h-6 md:w-6" />
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="text-gray-300 hover:text-white text-sm">
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}