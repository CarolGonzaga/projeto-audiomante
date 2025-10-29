// /client/src/components/Navbar/index.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { isAuthenticated, logout, loading, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState(''); // Estado para a busca
    const router = useRouter(); // Hook para navegação

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navega para a página de busca com o termo como query param
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="bg-[#4f3d6b] p-3 shadow-md sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/audiomante.png"
                        alt="Audiomante Logo"
                        width={218}
                        height={53}
                        className="h-8 w-auto md:h-10"
                    />
                </Link>

                {/* Formulário de Busca */}
                {!loading && isAuthenticated && (
                    // Envolve o input em um form
                    <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-lg mx-4 hidden md:block">
                        <input
                            type="search"
                            placeholder="Busque por título, autor, editora..."
                            value={searchQuery} // Controla o valor pelo estado
                            onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado
                            className="w-full p-2 pl-10 rounded-md bg-white/90 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85972]"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {/* Botão submit escondido ou estilizado se necessário */}
                        <button type="submit" className="hidden"></button>
                    </form>
                )}

                {/* Seção do Usuário */}
                {!loading && (
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <FaUserCircle className="text-gray-300 h-6 w-6 md:h-7 md:h-7" />
                                    <span className="text-sm text-gray-200 hidden lg:block"> Olá, {user.username.split(' ')[0]}! </span>
                                </div>
                                <button onClick={logout} className="text-gray-300 hover:text-white ml-4 cursor-pointer" title="Sair" > <FaSignOutAlt className="h-5 w-5 md:h-6 md:w-6" /> </button>
                            </>
                        ) : (<Link href="/login" className="text-gray-300 hover:text-white text-sm"> Login </Link>)}
                    </div>
                )}
            </div>
        </nav>
    );
}