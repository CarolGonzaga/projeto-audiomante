"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function HomePage() {
  const { isAuthenticated, logout, loading } = useAuth();

  // Se estiver carregando, mostra uma tela de loading simples
  if (loading) {
    return <div className="h-screen bg-[#2A233C]"></div>;
  }

  // Se o usuário JÁ ESTIVER LOGADO, redireciona para a estante
  if (isAuthenticated) {
    return (
      <div className="text-center p-10">
        <h1 className="font-display text-4xl text-[#F3D1D7] mb-4">Bem-vinda de volta!</h1>
        <Link href="/bookshelf" className="px-6 py-2 bg-[#E85972] hover:bg-[#d94862] text-white font-bold rounded-md">
          Ir para minha estante
        </Link>
      </div>
    );
  }

  // Se for um VISITANTE, mostra a landing page completa
  return (
    <div>
      {/* Seção Hero */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/capa.png"
          alt="Audiomante background"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-30"
        />
        <div className="z-10 relative">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-shadow-lg">
            Organize suas leituras.
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Sua estante virtual de livros sáficos, com um toque de magia.
          </p>
          <div className="mt-8 space-x-4">
            <Link href="/signup" className="px-8 py-3 bg-[#E85972] hover:bg-[#d94862] font-bold rounded-md transition-transform hover:scale-105">
              Criar minha conta
            </Link>
            <Link href="/login" className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-[#2A233C] font-bold rounded-md transition-colors">
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Seção "Como Funciona" */}
      <section className="py-20">
        <h2 className="text-4xl font-display text-center text-[#F3D1D7] mb-12">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">Busque</h3>
            <p className="text-gray-400">Encontre qualquer livro usando nossa busca integrada com o Google Books.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Organize</h3>
            <p className="text-gray-400">Adicione livros às suas estantes: 'Lido', 'Lendo' ou 'Quero Ler'.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Avalie</h3>
            <p className="text-gray-400">Dê notas e escreva resenhas para nunca mais esquecer o que achou de uma leitura.</p>
          </div>
        </div>
      </section>
    </div>
  );
}