// /client/src/components/BookCard/index.tsx
import Image from 'next/image';

interface BookCardProps {
    title: string;
    author: string;
    coverUrl: string | null;
}

export default function BookCard({ title, author, coverUrl }: BookCardProps) {
    return (
        // Adicionar w-36 para largura fixa, manter h-52
        <div className="group relative flex flex-col rounded-lg overflow-hidden shadow-md bg-white w-36 h-52 transition-transform duration-300 hover:shadow-xl mx-auto"> {/* Adicionado mx-auto se necessário centralizar no grid */}
            <div className="relative w-full h-full"> {/* Container relativo para a imagem */}
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt={`Capa do livro ${title}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover" // object-cover garante preenchimento sem distorção
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                        <span className="text-center text-xs text-gray-500 p-2">{title}</span> {/* Reduzir tamanho do placeholder */}
                    </div>
                )}
            </div>
            {/* Overlay com gradiente e texto */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/60 to-transparent"> {/* Reduzir padding */}
                <h3 className="font-semibold text-white text-xs truncate">{title}</h3> {/* Ajustar tamanho e peso */}
                <p className="text-xs text-gray-300 truncate">{author}</p>
            </div>
        </div>
    );
}