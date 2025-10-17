// client/src/app/bookshelf/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Definimos os tipos para os dados que virão da API
interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
}

interface BookshelfEntry {
    id: string;
    status: string;
    book: Book;
}

export default function BookshelfPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookshelf, setBookshelf] = useState<BookshelfEntry[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    useEffect(() => {
        // Se a verificação de autenticação ainda não terminou, não faz nada
        if (authLoading) {
            return;
        }

        // Se o usuário não estiver autenticado, redireciona para o login
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Se estiver autenticado, busca os dados da estante
        const fetchBookshelf = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves`);
                setBookshelf(response.data);
            } catch (error) {
                console.error('Erro ao buscar a estante:', error);
            } finally {
                setLoadingBooks(false);
            }
        };

        fetchBookshelf();
    }, [isAuthenticated, authLoading, router]);

    // Mostra uma mensagem de carregamento geral
    if (authLoading || loadingBooks) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#2A233C] text-white">
                <p>Carregando sua estante...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#2A233C] p-8 text-white">
            <h1 className="text-4xl font-bold text-[#F3D1D7] mb-8">Minha Estante</h1>

            {bookshelf.length === 0 ? (
                <p className="text-gray-400">Sua estante está vazia. Adicione alguns livros!</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {/* Aqui vamos mapear e mostrar os livros */}
                    {bookshelf.map((entry) => (
                        <div key={entry.id} className="bg-[#433A5E] p-4 rounded-lg">
                            <p className="font-bold">{entry.book.title}</p>
                            <p className="text-sm text-gray-300">{entry.book.author}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}