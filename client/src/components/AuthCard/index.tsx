// /client/src/components/AuthCard/index.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface AuthCardProps {
    children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {/* Logo no topo */}
            <div className="mb-6">
                <Image src="/audiomante.png" alt="Logo Audiomante" width={150} height={150} /> {/* Coloque Audiomante.png em /client/public */}
            </div>

            <div className="w-full max-w-sm bg-[#F3E0D6] rounded-xl shadow-2xl overflow-hidden text-gray-800"> {/* Cor creme do card */}
                {/* Abas */}
                <div className="flex">
                    <Link
                        href="/cadastro" // Link para a página de cadastro
                        className={`flex-1 py-3 text-center font-semibold ${!isLogin ? 'bg-[#433A5E] text-white rounded-tr-lg' : 'text-gray-500 hover:bg-gray-200' // Cor roxa escura para aba ativa
                            }`}
                    >
                        Cadastro
                    </Link>
                    <Link
                        href="/login" // Link para a página de login
                        className={`flex-1 py-3 text-center font-semibold ${isLogin ? 'bg-[#433A5E] text-white rounded-tl-lg' : 'text-gray-500 hover:bg-gray-200' // Cor roxa escura para aba ativa
                            }`}
                    >
                        Login
                    </Link>
                </div>

                {/* Conteúdo do Formulário */}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}