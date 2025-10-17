"use client";

import { useState, FormEvent, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import BookCard from '@/components/BookCard';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface GoogleBookItem {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        imageLinks?: {
            thumbnail?: string;
        };
    };
}

interface BookSearchResult {
    googleId: string;
    title: string;
    author: string;
    coverUrl: string | null;
    description: string | null;
}

export default function SearchPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<BookSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [addingBooks, setAddingBooks] = useState<Set<string>>(new Set());
    const [addedBooks, setAddedBooks] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSearch = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/search?q=${query}`
            );

            if (response.data.items) {
                const books = response.data.items.map((item: GoogleBookItem) => ({
                    googleId: item.id,
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconhecido',
                    coverUrl: item.volumeInfo.imageLinks?.thumbnail || null,
                    description: item.volumeInfo.description || null,
                }));
                setResults(books);
            } else {
                setResults([]);
            }

        } catch (err) {
            setError('Erro ao buscar livros. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (book: BookSearchResult) => {
        setAddingBooks(prev => new Set(prev).add(book.googleId));
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves`, {
                ...book,
                status: 'QUERO_LER', // Adiciona com um status padrão
            });
            setAddedBooks(prev => new Set(prev).add(book.googleId));
        } catch (error) {
            // CORREÇÃO AQUI
            let errorMessage = "Erro ao adicionar o livro."; // Mensagem padrão
            if (isAxiosError(error) && error.response?.data?.error) {
                // Se for um erro do Axios com uma mensagem da nossa API, use-a
                errorMessage = error.response.data.error;
            }
            alert(errorMessage);
        } finally {
            setAddingBooks(prev => {
                const newSet = new Set(prev);
                newSet.delete(book.googleId);
                return newSet;
            });
        }
    };

    if (authLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#2A233C] text-white">
                <p>Carregando...</p>
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-[#2A233C] p-8 text-white">
            {/* ... (seu formulário de busca) ... */}
            <h1 className="text-4xl font-bold text-[#F3D1D7] mb-8">Buscar Livros</h1>
            <form onSubmit={handleSearch} className="mb-8 flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite o título ou autor..."
                    className="w-full max-w-lg p-2 text-gray-200 bg-[#433A5E] rounded-md focus:outline-none"
                />
                <button type="submit" className="px-6 py-2 bg-[#E85972] hover:bg-[#d94862] font-bold rounded-md">
                    Buscar
                </button>
            </form>

            {loading && <p>Buscando...</p>}
            {error && <p className="text-red-400">{error}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {results.map((book) => (
                    <BookCard
                        key={book.googleId}
                        title={book.title}
                        author={book.author}
                        coverUrl={book.coverUrl}
                        // Passando a função e os estados para o card
                        onAdd={() => handleAddBook(book)}
                        isAdding={addingBooks.has(book.googleId)}
                        isAdded={addedBooks.has(book.googleId)}
                    />
                ))}
            </div>
        </div>
    );
}