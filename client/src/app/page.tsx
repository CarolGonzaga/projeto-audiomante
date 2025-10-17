"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#2A233C] text-white">
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#2A233C] text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#F3D1D7] mb-4">
          Bem-vinda ao Audiomante!
        </h1>

        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              Sua estante está pronta. Comece a adicionar seus livros!
            </p>

            <Link
              href="/bookshelf"
              className="px-6 py-2 bg-[#E85972] hover:bg-[#d94862] text-white font-bold rounded-md transition duration-300 mr-4"
            >
              Ver Minha Estante
            </Link>

            <button
              onClick={logout}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md transition duration-300"
            >
              Sair (Logout)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              Faça login para acessar sua estante de livros sáficos.
            </p>
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