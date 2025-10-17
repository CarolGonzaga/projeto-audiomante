// client/src/app/bookshelf/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const { id } = params;
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [entry, setEntry] = useState<BookshelfEntry | null>(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState('');
    const [rating, setRating] = useState<number | ''>('');
    const [review, setReview] = useState('');

    useEffect(() => {
        if (authLoading || !isAuthenticated) return;

        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${id}`);
                setEntry(response.data);
                setStatus(response.data.status);
                setRating(response.data.rating || '');
                setReview(response.data.review || '');
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

    const handleUpdateSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${id}`, {
                status,
                rating: rating === '' ? null : Number(rating),
                review,
            });

            if (entry) {
                setEntry({
                    ...entry,
                    status,
                    rating: rating === '' ? null : Number(rating),
                    review,
                });
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar a estante:", error);
            alert("Não foi possível salvar as alterações.");
        }
    };

    const handleDelete = async () => {
        // Pede confirmação ao usuário
        if (!window.confirm("Tem certeza que deseja remover este livro da sua estante?")) {
            return;
        }

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${id}`);
            alert("Livro removido com sucesso!");
            router.push('/bookshelf'); // Redireciona de volta para a estante
        } catch (error) {
            console.error("Erro ao remover o livro:", error);
            alert("Não foi possível remover o livro.");
        }
    };

    if (loading || authLoading) {
        return <div className="text-center p-10">Carregando...</div>;
    }

    if (!entry) {
        return <div className="text-center p-10">Livro não encontrado na sua estante.</div>;
    }

    return (
        <div className="p-8 text-white">
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

                    {isEditing ? (
                        <form onSubmit={handleUpdateSubmit} className="mt-6 space-y-4 bg-[#433A5E] p-6 rounded-lg">
                            <div>
                                <label className="block text-sm font-bold mb-2">Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 bg-[#2A233C] rounded-md">
                                    <option value="QUERO_LER">Quero Ler</option>
                                    <option value="LENDO">Lendo</option>
                                    <option value="LIDO">Lido</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Nota (0 a 5)</label>
                                <input type="number" min="0" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full p-2 bg-[#2A233C] rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Resenha</label>
                                <textarea value={review} onChange={(e) => setReview(e.target.value)} className="w-full p-2 bg-[#2A233C] rounded-md h-32" />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md font-bold">Salvar</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md">Cancelar</button>
                            </div>
                        </form>
                    ) : (

                        <div className="mt-6">
                            <p className="bg-[#433A5E] text-sm font-bold inline-block px-3 py-1 rounded-full text-[#F3D1D7]">{entry.status}</p>
                            {entry.rating && <p className="mt-4"><strong>Nota:</strong> {entry.rating} / 5</p>}

                            <p className="mt-4 text-gray-400">{entry.review || "Nenhuma resenha adicionada."}</p>
                            <p className="mt-6 text-gray-400">{entry.book.description || "Nenhuma descrição disponível."}</p>

                            <div className="mt-8 flex gap-4">
                                <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-[#E85972] hover:bg-[#d94862] rounded-md font-bold">
                                    Editar
                                </button>
                                <button onClick={handleDelete} className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md font-bold">
                                    Remover
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}