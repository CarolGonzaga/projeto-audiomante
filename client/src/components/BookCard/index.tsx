// client/src/components/BookCard/index.tsx
import Image from 'next/image';

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
        <div className="group relative flex flex-col rounded-lg overflow-hidden shadow-lg bg-[#433A5E] transition-transform duration-300 hover:scale-105">
            {onAdd && (
                <button
                    onClick={onAdd}
                    disabled={isAdding || isAdded}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-[#E85972] disabled:bg-green-500 disabled:cursor-not-allowed transition-colors"
                    aria-label="Adicionar à estante"
                >
                    {isAdded ? '✓' : isAdding ? '...' : '+'}
                </button>
            )}

            {coverUrl ? (
                <Image
                    src={coverUrl}
                    alt={`Capa do livro ${title}`}
                    width={200}
                    height={300}
                    className="w-full h-auto object-cover aspect-[2/3]"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-auto aspect-[2/3] bg-[#2A233C]">
                    <span className="text-center text-sm text-gray-300 p-2">{title}</span>
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-bold text-white truncate">{title}</h3>
                <p className="text-sm text-gray-300 truncate">{author}</p>
            </div>
        </div>
    );
}