"use client";

import { useEffect, useState, FormEvent, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';
import LoadingOverlay from '@/components/LoadingOverlay';

// Interfaces (mantidas)
interface Book {
    title: string;
    author: string;
    coverUrl: string | null;
    description: string | null;
    pageCount?: number | null; // Adicionar pageCount
    publishedDate?: string | null; // Adicionar publishedDate
}
interface BookshelfEntry {
    id: string; // Adicionar id da entrada da estante
    status: string;
    rating: number | null;
    review: string | null;
    book: Book;
}

// Componente para Modal de Edição (opcional, para separar a lógica)
const EditModal = ({ entryId, initialRating, initialReview, onClose, onSave }: {
    entryId: string;
    initialRating: number | null;
    initialReview: string | null;
    onClose: () => void;
    onSave: (updatedEntry: Partial<BookshelfEntry>) => void; // Callback para atualizar estado local
}) => {
    const [rating, setRating] = useState<number | ''>(initialRating ?? '');
    const [review, setReview] = useState(initialReview ?? '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatedData = {
                rating: rating === '' ? null : Number(rating),
                review: review,
            };
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${entryId}`, updatedData);
            onSave(updatedData); // Atualiza estado na página pai
            onClose(); // Fecha o modal
        } catch (error) {
            console.error("Erro ao atualizar a estante:", error);
            alert("Não foi possível salvar as alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#4f3d6b] p-6 rounded-lg shadow-xl w-full max-w-md text-white">
                <h2 className="text-xl font-bold mb-4 text-[#F3D1D7]">Editar Resenha e Nota</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="rating" className="block text-sm font-bold mb-1 text-gray-300">Nota (0 a 5)</label>
                        <input
                            id="rating"
                            type="number"
                            min="0"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full p-2 bg-[#2A233C] rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E85972]"
                        />
                    </div>
                    <div>
                        <label htmlFor="review" className="block text-sm font-bold mb-1 text-gray-300">Resenha</label>
                        <textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="w-full p-2 bg-[#2A233C] rounded-md h-32 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E85972]"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold text-sm"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params; // Este é o ID da *entrada* na Bookshelf
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [entry, setEntry] = useState<BookshelfEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

    // Estado local para o status, atualizado imediatamente
    const [currentStatus, setCurrentStatus] = useState('');

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchBookDetails = async () => {
            setLoading(true); // Garante loading ao buscar
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${id}`);
                setEntry(response.data);
                setCurrentStatus(response.data.status); // Define o status inicial
            } catch (error) {
                console.error("Erro ao buscar detalhes do livro:", error);
                setEntry(null); // Define como nulo em caso de erro
            } finally {
                setLoading(false);
            }
        };

        if (id && isAuthenticated) { // Verifica isAuthenticated antes de buscar
            fetchBookDetails();
        } else if (!authLoading && !isAuthenticated) {
            router.push('/login'); // Redireciona se não autenticado após loading
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isAuthenticated, authLoading]); // Remover router daqui para evitar loop

    // Função para atualizar o status via API
    const handleStatusChange = async (newStatus: string) => {
        if (!entry || newStatus === currentStatus) return;

        setCurrentStatus(newStatus); // Atualiza otimisticamente a UI

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${entry.id}`, {
                status: newStatus,
            });
            // Atualiza o estado principal se quiser (opcional, já que currentStatus controla a UI)
            setEntry(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Não foi possível atualizar o status.");
            setCurrentStatus(entry.status); // Reverte a UI em caso de erro
        }
    };

    // Função para deletar
    const handleDelete = async () => {
        if (!entry || !window.confirm("Tem certeza que deseja remover este livro da sua estante?")) {
            return;
        }
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${entry.id}`);
            alert("Livro removido com sucesso!");
            router.push('/bookshelf');
        } catch (error) {
            console.error("Erro ao remover o livro:", error);
            alert("Não foi possível remover o livro.");
        }
    };

    // Função chamada pelo Modal para atualizar o estado local
    const handleSaveEdit = (updatedData: Partial<BookshelfEntry>) => {
        setEntry(prev => prev ? { ...prev, ...updatedData } : null);
    };

    // Extrai o ano da data de publicação
    const publicationYear = useMemo(() => {
        if (entry?.book?.publishedDate) {
            return new Date(entry.book.publishedDate).getFullYear();
        }
        return 'N/A';
    }, [entry?.book?.publishedDate]);

    // --- Estados de Carregamento e Erro ---
    if (loading || authLoading) {
        return <LoadingOverlay isVisible={true} />; // Usa o overlay aqui
    }

    if (!entry) {
        return (
            <div className="flex flex-col flex-grow bg-[#e1d9d0] text-[#1E192B] items-center justify-center p-8">
                <Link href="/bookshelf" className="text-[#4f3d6b] hover:text-[#3e3055] mb-4 inline-flex items-center gap-2">
                    <FaArrowLeft /> Voltar para Estante
                </Link>
                <p className="text-center text-red-600">Livro não encontrado na sua estante.</p>
            </div>
        );
    }

    // --- Renderização Principal ---
    return (
        // Container da PÁGINA: flex-col, flex-grow, fundo bege
        <div className="flex flex-col flex-grow bg-[#e1d9d0] text-[#1E192B] h-full">
            {/* Container do CONTEÚDO */}
            <div className="container mx-auto p-4 md:p-8 flex-grow">

                {/* Botão Voltar */}
                <div className="mb-20">
                    <Link href="/bookshelf" className="text-[#4f3d6b] hover:text-[#3e3055] inline-flex items-center gap-2 text-sm">
                        <FaArrowLeft /> Voltar para Estante
                    </Link>
                </div>

                {/* Grid Principal (1 coluna mobile, 3 desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">

                    {/* Coluna Esquerda (Imagem e Status) */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-full max-w-52 aspect-[2/3] relative rounded-lg shadow-lg overflow-hidden mb-6">
                            {entry.book.coverUrl ? (
                                <Image
                                    src={entry.book.coverUrl}
                                    alt={`Capa de ${entry.book.title}`}
                                    fill
                                    sizes="(max-width: 768px) 80vw, 208px" // Ajustado
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="bg-gray-300 h-full flex items-center justify-center text-gray-500">Capa indisponível</div>
                            )}
                        </div>

                        {/* Seletor de Status */}
                        <div className="w-full max-w-52">
                            <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                            <div className="relative">
                                <select
                                    id="statusSelect"
                                    value={currentStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-[#1E192B] focus:outline-none focus:ring-2 focus:ring-[#4f3d6b] appearance-none pr-8"
                                >
                                    <option value="QUERO_LER">Quero Ler</option>
                                    <option value="LENDO">Lendo</option>
                                    <option value="LIDO">Lido</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <FaChevronDown size={12} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita (Detalhes e Ações) */}
                    <div className="md:col-span-4 bg-white/50 p-6 rounded-lg shadow-md"> {/* Card com fundo leve */}
                        <h1 className="text-1xl lg:text-2xl font-bold text-[#4f3d6b] mb-1">{entry.book.title}</h1>
                        <p className="text-md text-gray-700 mb-4">{entry.book.author}</p>

                        {/* Detalhes Adicionais */}
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            {entry.book.pageCount && <span> • {entry.book.pageCount} páginas</span>}
                            {publicationYear !== 'N/A' && <span> • Publicado em {publicationYear}</span>}
                        </div>

                        {/* Descrição */}
                        <h2 className="text-md font-semibold text-[#4f3d6b] mt-6 mb-2">Resumo</h2>
                        <div
                            className="text-gray-700 leading-relaxed text-sm space-y-4"
                            dangerouslySetInnerHTML={{ __html: entry.book.description || "Nenhuma descrição disponível." }}
                        />

                        {/* Resenha e Nota */}
                        <h2 className="text-md font-semibold text-[#4f3d6b] mt-6 mb-2">Sua Avaliação</h2>
                        {entry.rating !== null && <p className="text-sm font-bold">Nota: {entry.rating} / 5</p>}
                        <p className={`mt-2 text-gray-700 text-sm ${!entry.review && 'italic'}`}>
                            {entry.review || "Nenhuma resenha adicionada."}
                        </p>

                        {/* Botões de Ação */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsEditingModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#6b537d] hover:bg-[#4f3d6b] text-white rounded-md font-semibold text-sm"
                            >
                                <FaEdit /> Editar Resenha/Nota
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold text-sm"
                            >
                                <FaTrash /> Remover da Estante
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer com mt-auto */}
            <footer className="text-center text-xs text-gray-500 py-3 border-t border-gray-300 w-full mt-auto bg-[#4d3859]">
                © {new Date().getFullYear()} Carol Gonzaga
            </footer>

            {/* Modal de Edição */}
            {isEditingModalOpen && entry && (
                <EditModal
                    entryId={entry.id}
                    initialRating={entry.rating}
                    initialReview={entry.review}
                    onClose={() => setIsEditingModalOpen(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
}