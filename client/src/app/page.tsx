// client/src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePageRedirect() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só executa o redirecionamento depois que o estado de autenticação for carregado
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/bookshelf'); // Usa replace para não adicionar ao histórico
      } else {
        router.replace('/login'); // Usa replace para não adicionar ao histórico
      }
    }
  }, [isAuthenticated, loading, router]);

  // Mostra uma tela de carregamento vazia enquanto verifica a autenticação
  return (
    <div className="min-h-screen bg-[#2A233C]">
      {/* Pode adicionar um spinner de loading aqui se preferir */}
    </div>
  );
}