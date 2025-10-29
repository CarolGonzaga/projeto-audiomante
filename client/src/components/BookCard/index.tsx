import Image from 'next/image';
import { FaPlus, FaCheck, FaSpinner } from 'react-icons/fa';

interface BookCardProps {
    title: string;
    author: string;
    coverUrl: string | null;
    onAdd?: () => void;
    isAdding?: boolean;
    isAdded?: boolean;
}

export default function BookCard({ title, author, coverUrl, onAdd, isAdding, isAdded }: BookCardProps) {
    return (
        <div className="group relative flex flex-col rounded-lg overflow-hidden shadow-md bg-white w-36 h-52 transition-transform duration-300 hover:shadow-xl mx-auto">
            <div className="relative w-full h-full">
                {coverUrl ? (
                    <Image src={coverUrl} alt={`Capa do livro ${title}`} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover" />
                ) : (<div className="flex items-center justify-center w-full h-full bg-gray-200"> <span className="text-center text-xs text-gray-500 p-2">{title}</span> </div>)}
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                <h3 className="font-semibold text-white text-xs truncate mb-1">{title}</h3>
                <p className="text-xs text-gray-300 truncate mb-2">{author}</p>
                {/* Botão Adicionar (só aparece se onAdd for passado) */}
                {onAdd && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }} // Previne navegação do Link pai
                        disabled={isAdding || isAdded}
                        className={`w-full text-xs py-1 px-2 rounded flex items-center justify-center gap-1 transition ${isAdded ? 'bg-green-600 text-white cursor-default' :
                                isAdding ? 'bg-gray-500 text-white cursor-wait' :
                                    'bg-[#4f3d6b] hover:bg-[#3e3055] text-white'
                            }`}
                    >
                        {isAdded ? <FaCheck /> : (isAdding ? <FaSpinner className="animate-spin" /> : <FaPlus />)}
                        {isAdded ? 'Adicionado' : (isAdding ? 'Adicionando...' : 'Adicionar')}
                    </button>
                )}
            </div>
            {/* Overlay Fixo (visível sempre) para título/autor quando não hover */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <h3 className="font-semibold text-white text-xs truncate">{title}</h3>
                <p className="text-xs text-gray-300 truncate">{author}</p>
            </div>
        </div>
    );
}