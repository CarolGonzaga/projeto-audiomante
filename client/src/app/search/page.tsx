"use client";

import { useState, FormEvent } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';

interface GoogleBookItem {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
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
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<BookSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                // 2. USAMOS A NOVA INTERFACE NO .map()
                const books = response.data.items.map((item: GoogleBookItem) => ({
                    googleId: item.id,
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconhecido',
                    coverUrl: item.volumeInfo.imageLinks?.thumbnail || null,
                }));
                setResults(books);
            } else {
                setResults([]); // Limpa os resultados se a busca não retornar nada
            }

        } catch (err) {
            setError('Erro ao buscar livros. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // ... (o resto do seu código JSX permanece o mesmo)
    return (
        <main className="min-h-screen bg-[#2A233C] p-8 text-white">
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
                    />
                ))}
            </div>
        </main>
    );
}