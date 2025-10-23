// /client/src/components/LoadingOverlay.tsx
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
    isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
    const [show, setShow] = useState(false);

    // Controla o estado interno 'show' para permitir a animação de fade-out
    useEffect(() => {
        if (isVisible) {
            setShow(true);
        } else {
            // Pequeno delay antes de remover o componente para a animação de fade-out ocorrer
            const timer = setTimeout(() => setShow(false), 300); // Duração da transição
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!show && !isVisible) return null; // Não renderiza se não for visível e a animação de saída terminou

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#4d3859] text-white transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none' // Controla fade-in/out
                }`}
        >
            {/* Imagem de fundo com overlay (similar à coluna esquerda) */}
            <div className="absolute inset-0 z-0" aria-hidden="true">
                <Image
                    src="/background.png"
                    alt="" // Decorativo
                    fill
                    className="object-cover w-full h-full opacity-60"
                    priority // Garante carregamento rápido se visível inicialmente
                />
                <div className="absolute inset-0 bg-[#4d3859]/70" />
            </div>

            {/* Logo com Animação */}
            {/* Aplicaremos uma animação customizada 'logo-pulse' */}
            <div className="relative z-10 animate-logo-pulse">
                <Image
                    src="/Audiomante.svg"
                    alt="Audiomante Logo Carregando"
                    width={200}
                    height={200}
                />
            </div>
        </div>
    );
};

export default LoadingOverlay;