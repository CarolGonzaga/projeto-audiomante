// /client/src/app/bookshelf/[id]/page.tsx

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

// ... [Interfaces e Componente EditModal permanecem os mesmos] ...
interface Book {
    title: string;
    author: string;
    coverUrl: string | null;
    description: string | null;
    pageCount?: number | null;
    publishedDate?: string | null;
}
interface BookshelfEntry {
    id: string;
    status: string;
    rating: number | null;
    review: string | null;
    book: Book;
}
const EditModal = ({ entryId, initialRating, initialReview, onClose, onSave }: {
    entryId: string;
    initialRating: number | null;
    initialReview: string | null;
    onClose: () => void;
    onSave: (updatedEntry: Partial<BookshelfEntry>) => void;
}) => {
    // ... [Código do EditModal não muda] ...
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
            onSave(updatedData);
            onClose();
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
    // ... [Hooks e funções não mudam] ...
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [entry, setEntry] = useState<BookshelfEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [activeTab, setActiveTab] = useState<'sobre' | 'avaliacao'>('sobre');

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchBookDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${id}`);
                setEntry(response.data);
                setCurrentStatus(response.data.status);
            } catch (error) {
                console.error("Erro ao buscar detalhes do livro:", error);
                setEntry(null);
            } finally {
                setLoading(false);
            }
        };

        if (id && isAuthenticated) {
            fetchBookDetails();
        } else if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [id, isAuthenticated, authLoading, router]);

    const handleStatusChange = async (newStatus: string) => {
        if (!entry || newStatus === currentStatus) return;
        setCurrentStatus(newStatus);
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves/${entry.id}`, {
                status: newStatus,
            });
            setEntry(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Não foi possível atualizar o status.");
            setCurrentStatus(entry.status);
        }
    };

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

    const handleSaveEdit = (updatedData: Partial<BookshelfEntry>) => {
        setEntry(prev => prev ? { ...prev, ...updatedData } : null);
    };

    const publicationYear = useMemo(() => {
        if (entry?.book?.publishedDate) {
            return new Date(entry.book.publishedDate).getFullYear();
        }
        return 'N/A';
    }, [entry?.book?.publishedDate]);

    // --- Estados de Carregamento e Erro ---
    if (loading || authLoading) {
        return <LoadingOverlay isVisible={true} />;
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
        <div className="flex flex-col bg-[#e1d9d0] text-[#1E192B] md:h-full">
            <div className="container mx-auto p-4 md:p-8 flex-grow flex flex-col md:h-full md:min-h-0">

                {/* Botão Voltar */}
                <div className="mb-10">
                    <Link href="/bookshelf" className="text-[#4f3d6b] hover:text-[#3e3055] inline-flex items-center gap-2 text-sm">
                        <FaArrowLeft /> Voltar para Estante
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 md:flex-grow md:min-h-0">

                    {/* Coluna Esquerda (Imagem e Status) */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        {/* ... (código da imagem e status seletor) ... */}
                        <div className="w-full max-w-52 aspect-[2/3] relative rounded-lg shadow-lg overflow-hidden mb-6">
                            {entry.book.coverUrl ? (
                                <Image
                                    src={entry.book.coverUrl}
                                    alt={`Capa de ${entry.book.title}`}
                                    fill
                                    sizes="(max-width: 768px) 80vw, 208px"
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="bg-gray-300 h-full flex items-center justify-center text-gray-500">Capa indisponível</div>
                            )}
                        </div>
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
                    {/* MUDANÇA 1: Adicionado 'text-center' (mobile) e 'md:text-left' (desktop) 
                    */}
                    <div className="md:col-span-4 bg-white/50 p-6 rounded-lg shadow-md flex flex-col md:min-h-0 text-center md:text-left">

                        {/* --- 1. CABEÇALHO (FIXO) --- */}
                        <div>
                            <h1 className="text-1xl lg:text-2xl font-bold text-[#4f3d6b] mb-1">{entry.book.title}</h1>
                            <p className="text-md text-gray-700 mb-4">{entry.book.author}</p>

                            {/* MUDANÇA 2: Centralizar os 'badges' no mobile */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                                {entry.book.pageCount &&
                                    <span className="bg-[#e1d9d0] px-2 py-0.5 rounded-full">
                                        {entry.book.pageCount} páginas
                                    </span>}
                                {publicationYear !== 'N/A' &&
                                    <span className="bg-[#e1d9d0] px-2 py-0.5 rounded-full">
                                        Publicado em {publicationYear}
                                    </span>}
                            </div>

                            {/* --- ABAS DE NAVEGAÇÃO --- */}
                            <div className="border-b border-gray-300 mb-4">
                                {/* MUDANÇA 3: Centralizar as abas no mobile */}
                                <nav className="-mb-px flex justify-center md:justify-start gap-4">
                                    <button
                                        onClick={() => setActiveTab('sobre')}
                                        className={`py-2 px-1 border-b-2 font-semibold ${activeTab === 'sobre'
                                                ? 'border-[#4f3d6b] text-[#4f3d6b]'
                                                : 'border-transparent text-gray-500 hover:text-[#4f3d6b] hover:border-gray-400'
                                            }`}
                                    >
                                        Sobre o Livro
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('avaliacao')}
                                        className={`py-2 px-1 border-b-2 font-semibold ${activeTab === 'avaliacao'
                                                ? 'border-[#4f3d6b] text-[#4f3d6b]'
                                                : 'border-transparent text-gray-500 hover:text-[#4f3d6b] hover:border-gray-400'
                                            }`}
                                    >
                                        Sua Avaliação
                                    </button>
                                </nav>
                            </div>
                        </div> {/* Fim do Cabeçalho Fixo */}


                        {/* --- 2. CONTEÚDO (COM ROLAGEM) --- */}
                        {/* (O 'text-center md:text-left' do pai vai cuidar do alinhamento do texto aqui) */}
                        <div className="md:flex-grow md:overflow-y-auto pr-2">
                            <div className={activeTab === 'sobre' ? 'block' : 'hidden'}>
                                <div
                                    className="text-gray-700 leading-relaxed text-sm space-y-4"
                                    dangerouslySetInnerHTML={{ __html: entry.book.description || "Nenhuma descrição disponível." }}
                                />
                            </div>
                            <div className={activeTab === 'avaliacao' ? 'block' : 'hidden'}>
                                {entry.rating !== null && <p className="text-sm font-bold">Nota: {entry.rating} / 5</p>}
                                <p className={`mt-2 text-gray-700 text-sm ${!entry.review && 'italic'}`}>
                                    {entry.review || "Nenhuma resenha adicionada."}
                                </p>
                            </div>
                        </div> {/* Fim do Conteúdo com Rolagem */}


                        {/* --- 3. FOOTER DO CARD (FIXO) --- */}
                        {/* MUDANÇA 4: Centralizar o botão no mobile */}
                        <div className="mt-8 md:mt-auto pt-4 border-t border-gray-300 flex justify-center md:justify-start">
                            {activeTab === 'sobre' && (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold text-sm"
                                >
                                    <FaTrash /> Remover da Estante
                                </button>
                            )}
                            {activeTab === 'avaliacao' && (
                                <button
                                    onClick={() => setIsEditingModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#6b537d] hover:bg-[#4f3d6b] text-white rounded-md font-semibold text-sm"
                                >
                                    <FaEdit /> Editar Resenha/Nota
                                </button>
                            )}
                        </div>

                    </div> {/* Fim da Coluna Direita */}
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