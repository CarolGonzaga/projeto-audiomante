"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import BookCard from '@/components/BookCard';
import { FaPlus, FaEllipsisV, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Ícones de paginação

interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
}

interface BookshelfEntry {
    id: string;
    status: string; // 'LIDO', 'LENDO', 'QUERO_LER'
    book: Book;
}

interface SummaryCardProps {
    title: string;
    value: number | string;
    unit: string;
}

const summaryCardBgColor = "bg-[#c2b8bb]";
const summaryCardTextColor = "text-[#1E192B]";
const summaryCardMutedColor = "text-gray-600";

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, unit }) => (
    <div className={`p-4 rounded-lg shadow-md ${summaryCardBgColor} ${summaryCardTextColor}`}>
        <h2 className={`text-sm font-semibold ${summaryCardMutedColor} mb-2`}>{title}</h2>

        <div className="flex justify-between items-baseline mt-1">
            <span className="text-4xl font-bold">{value}</span>
            <span className={`text-sm ${summaryCardMutedColor} self-end`}>{unit}</span>
        </div>
    </div>
);


export default function BookshelfPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookshelf, setBookshelf] = useState<BookshelfEntry[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    // --- PAGINAÇÃO ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6); // Valor inicial, pode ser ajustado

    // Determina itemsPerPage baseado no tamanho da tela (exemplo)
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 640) { // sm breakpoint (exemplo mobile)
                setItemsPerPage(3); // Exibe 4 livros no mobile (2 colunas)
            } else if (window.innerWidth < 1024) { // lg breakpoint (exemplo tablet)
                setItemsPerPage(4); // Exibe 6 livros no tablet (3 colunas)
            } else { // Desktop
                setItemsPerPage(6); // Exibe 10 livros no desktop (5 colunas no grid, 2 linhas) ou 12 (6 colunas)
            }
        };
        updateItemsPerPage(); // Define na carga inicial
        window.addEventListener('resize', updateItemsPerPage); // Atualiza no resize
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    // Calcula os itens para a página atual
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = useMemo(() => bookshelf.slice(firstItemIndex, lastItemIndex), [bookshelf, firstItemIndex, lastItemIndex]);
    const totalPages = Math.ceil(bookshelf.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchBookshelf = async () => {
            setLoadingBooks(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookshelves`);
                setBookshelf(response.data);
                setCurrentPage(1);
            } catch (error) {
                console.error('Erro ao buscar a estante:', error);
            } finally {
                setLoadingBooks(false);
            }
        };

        fetchBookshelf();
    }, [isAuthenticated, authLoading, router]);

    const summaryData = useMemo(() => {
        const counts = { LIDO: 0, LENDO: 0, QUERO_LER: 0 };
        bookshelf.forEach(entry => {
            if (counts[entry.status as keyof typeof counts] !== undefined) {
                counts[entry.status as keyof typeof counts]++;
            }
        });
        return counts;
    }, [bookshelf]);

    if (authLoading || (loadingBooks && bookshelf.length === 0)) {
        return (
            <main className="flex flex-grow min-h-screen items-center justify-center bg-[#e1d9d0] text-[#1E192B]">
                <p>Carregando sua estante...</p>
            </main>
        );
    }

    return (
        // Container da PÁGINA: Força altura total (h-full) do espaço disponível no <main>
        <div className="flex flex-col flex-grow bg-[#e1d9d0] text-[#1E192B] overflow-hidden h-full">

            {/* Container do CONTEÚDO PRINCIPAL: Mantém flex-grow */}
            <div className="container mx-auto p-4 md:p-6 flex-grow overflow-auto">

                {/* Seção de Sumário */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {/* ... Cards ... */}
                    <SummaryCard title="Paginômetro" value={"?"} unit="páginas" />
                    <SummaryCard title="Lido" value={summaryData.LIDO} unit="livros" />
                    <SummaryCard title="Lendo" value={summaryData.LENDO} unit={summaryData.LENDO === 1 ? "livro" : "livros"} />
                    <SummaryCard title="Quero Ler" value={summaryData.QUERO_LER} unit="livros" />
                </div>

                {/* Seção da Estante */}
                <div className="flex justify-between items-center mb-6">
                    {/* ... Cabeçalho Estante ... */}
                    <div> <h2 className="text-2xl font-bold text-[#4f3d6b]">Estante</h2> <span className="text-sm text-gray-600">{bookshelf.length} livros</span> </div>
                    <div className="flex items-center gap-4"> <Link href="/search" className="flex items-center gap-2 px-4 py-2 bg-[#4f3d6b] hover:bg-[#3e3055] rounded-md font-bold text-white text-sm"> <FaPlus /> Adicionar livro </Link> <button className="text-gray-500 hover:text-[#4f3d6b]"> <FaEllipsisV /> </button> </div>
                </div>

                {/* Grid de Livros */}
                {currentItems.length === 0 && !loadingBooks ? (
                    <p className="text-gray-600 text-center py-10">Sua estante está vazia.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                        {/* ... Mapeamento dos Livros ... */}
                        {currentItems.map((entry) => (
                            <Link key={entry.id} href={`/bookshelf/${entry.id}`} className="block flex justify-center">
                                <BookCard title={entry.book.title} author={entry.book.author} coverUrl={entry.book.coverUrl} />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 md:mt-12 space-x-1 text-sm text-[#4f3d6b]">
                        {/* ... Paginação ... */}
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded hover:bg-[#c2b8bb]/50 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Página anterior" > <FaChevronLeft /> </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            if (totalPages <= 5 || pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) { return (<button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`p-1 w-8 h-8 rounded font-semibold ${currentPage === pageNum ? 'bg-[#4f3d6b] text-white' : 'hover:bg-[#c2b8bb]/50'}`} > {pageNum} </button>); }
                            else if (Math.abs(pageNum - currentPage) === 2) { return <span key={pageNum} className="p-1 w-8 h-8 text-center">...</span>; }
                            return null;
                        })}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded hover:bg-[#c2b8bb]/50 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Próxima página" > <FaChevronRight /> </button>
                    </div>
                )}

            </div> {/* Fim do container flex-grow do conteúdo */}

            {/* Footer: Mantém mt-auto */}
            <footer className="text-center text-xs text-gray-500 py-3 border-t border-gray-300 w-full mt-auto bg-[#4d3859]">
                © {new Date().getFullYear()} Carol Gonzaga
            </footer>

        </div> // Fim do container da PÁGINA (agora flex flex-col h-full)
    );
}