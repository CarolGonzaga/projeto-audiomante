"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import BookCard from '@/components/BookCard';

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
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-[#F3D1D7]">Minha Estante</h1>
                <Link href="/search" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md font-bold">
                    + Adicionar Livro
                </Link>
            </div>

            {bookshelf.length === 0 ? (
                <p className="text-gray-400">Sua estante está vazia. Adicione alguns livros!</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {bookshelf.map((entry) => (
                        <Link key={entry.id} href={`/bookshelf/${entry.id}`}>
                            <BookCard
                                title={entry.book.title}
                                author={entry.book.author}
                                coverUrl={entry.book.coverUrl}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}