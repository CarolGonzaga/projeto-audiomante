// client/src/components/BookCard/index.tsx
import Image from 'next/image';

interface BookCardProps {
    title: string;
    author: string;
    coverUrl: string | null;
}

export default function BookCard({ title, author, coverUrl }: BookCardProps) {
    return (
        <div className="group relative flex flex-col rounded-lg overflow-hidden shadow-lg bg-[#433A5E] transition-transform duration-300 hover:scale-105">
            {coverUrl ? (
                <Image
                    src={coverUrl}
                    alt={`Capa do livro ${title}`}
                    width={200}
                    height={300}
                    className="w-full h-auto object-cover"
                />
            ) : (
                // Placeholder para livros sem capa
                <div className="flex items-center justify-center w-full h-[300px] bg-[#2A233C]">
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