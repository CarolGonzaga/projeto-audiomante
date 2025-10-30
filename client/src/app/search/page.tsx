"use client";

import { useState, useEffect, Suspense } from 'react';
import axios, { isAxiosError } from 'axios';
import BookCard from '@/components/BookCard';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPlus, FaCheck, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import LoadingOverlay from '@/components/LoadingOverlay';

interface GoogleBookItem { id: string; volumeInfo: { title: string; authors?: string[]; description?: string; imageLinks?: { thumbnail?: string; }; pageCount?: number; }; }
interface BookSearchResult { googleId: string; title: string; author: string; coverUrl: string | null; description: string | null; pageCount?: number | null; }


function SearchContent() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [results, setResults] = useState<BookSearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSearchTerm, setCurrentSearchTerm] = useState<string | null>(null);
    const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);

    const [addingBooks, setAddingBooks] = useState<Set<string>>(new Set());
    const [addedBooks, setAddedBooks] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        const urlQuery = searchParams.get('q');

        if (urlQuery) {
            setIsShowingSuggestions(false);
            handleSearch(urlQuery);
        } else {
            setIsShowingSuggestions(true);
            fetchSuggestions();
        }
    }, [searchParams]);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        setResults([]);
        setCurrentSearchTerm(null);
        setIsShowingSuggestions(true);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/suggestions`);
            setResults(response.data);
        } catch (err) {
            setError('Erro ao buscar sugestões. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);
        setResults([]);
        setCurrentSearchTerm(searchTerm);
        setIsShowingSuggestions(false);

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(searchTerm.trim())}`
            );

            if (response.data.items) {
                const books = response.data.items.map((item: GoogleBookItem) => ({ googleId: item.id, title: item.volumeInfo.title, author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconhecido', coverUrl: item.volumeInfo.imageLinks?.thumbnail || null, description: item.volumeInfo.description || null, pageCount: item.volumeInfo.pageCount || null, }));
                setResults(books);
            } else { setResults([]); }
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
                status: 'QUERO_LER',
            });
            setAddedBooks(prev => new Set(prev).add(book.googleId));
        } catch (error) {
            let errorMessage = "Erro ao adicionar o livro.";
            if (isAxiosError(error) && error.response?.data?.error) {
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
        return <LoadingOverlay isVisible={true} />;
    }

    return (
        <div className="flex flex-col flex-grow bg-[#e1d9d0] text-[#1E192B] h-full">
            <div className="container mx-auto p-4 md:p-8 flex-grow">

                {/* Botão Voltar e Título Dinâmico */}
                <div className="flex items-center gap-4 my-6">
                    <Link href="/bookshelf" className="text-[#4f3d6b] hover:text-[#3e3055]" title="Voltar para Estante"> <FaArrowLeft size={20} /> </Link>
                    <h1 className="text-lg font-bold text-[#4f3d6b]">
                        {isShowingSuggestions ? "Nossas Sugestões" : `Resultados para '${currentSearchTerm}'`}
                    </h1>
                </div>

                {/* Loading (sem overlay aqui, apenas texto) */}
                {loading && <div className="text-center py-10 text-gray-600">Carregando livros...</div>}
                {error && <p className="text-red-600 text-center py-10">{error}</p>}

                {/* Mensagem de nenhum resultado (só para buscas, não para sugestões) */}
                {!isShowingSuggestions && results.length === 0 && !loading && currentSearchTerm && (
                    <p className="text-gray-600 text-center py-10">Nenhum livro encontrado para &apos;{currentSearchTerm}&apos;.</p>
                )}

                {/* Grid de Livros (só mostra se não estiver loading) */}
                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                        {results.map((book) => (
                            <div key={book.googleId} className="flex justify-center">
                                <BookCard /* ...props... */ title={book.title} author={book.author} coverUrl={book.coverUrl} onAdd={() => handleAddBook(book)} isAdding={addingBooks.has(book.googleId)} isAdded={addedBooks.has(book.googleId)} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="text-center text-xs text-gray-500 py-3 border-t border-gray-300 w-full mt-auto bg-[#4d3859]">
                © {new Date().getFullYear()} Carol Gonzaga
            </footer>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<LoadingOverlay isVisible={true} />}>
            <SearchContent />
        </Suspense>
    );
}