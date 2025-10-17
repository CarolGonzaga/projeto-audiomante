// client/src/app/bookshelf/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import Image from 'next/image';

// (Você pode mover estas interfaces para um arquivo compartilhado depois)
interface Book {
    title: string;
    author: string;
    coverUrl: string | null;
    description: string | null;
}
interface BookshelfEntry {
    status: string;
    rating: number | null;
    review: string | null;
    book: Book;
}

export default function BookDetailPage() {
    const params = useParams();
    const { id } = params;
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [entry, setEntry] = useState<BookshelfEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) return; // A página da estante já protege, mas é uma boa prática

        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${id}`);
                setEntry(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do livro:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookDetails();
        }
    }, [id, isAuthenticated, authLoading]);

    if (loading || authLoading) {
        return <div className="text-center p-10">Carregando...</div>;
    }

    if (!entry) {
        return <div className="text-center p-10">Livro não encontrado na sua estante.</div>;
    }

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    {entry.book.coverUrl && (
                        <Image
                            src={entry.book.coverUrl}
                            alt={`Capa de ${entry.book.title}`}
                            width={400}
                            height={600}
                            className="rounded-lg shadow-lg w-full"
                        />
                    )}
                </div>
                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold text-[#F3D1D7]">{entry.book.title}</h1>
                    <p className="text-xl text-gray-300 mt-2 mb-4">{entry.book.author}</p>
                    <p className="bg-[#433A5E] text-sm font-bold inline-block px-3 py-1 rounded-full text-[#F3D1D7]">
                        {entry.status}
                    </p>
                    <p className="mt-6 text-gray-400">{entry.book.description || "Nenhuma descrição disponível."}</p>
                </div>
            </div>
        </div>
    );
}