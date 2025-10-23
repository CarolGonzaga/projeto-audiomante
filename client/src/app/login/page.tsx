// /client/src/app/login/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Mantido aqui para GoogleIcon, pode ser removido se o ícone for externo
import Link from "next/link";
import Input from "@/components/Input"; // Importa o novo componente

export default function AuthPage() {
    const [tab, setTab] = useState<"login" | "signup">("login");
    const { login } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    // showPassword agora é gerenciado dentro do componente Input
    // const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Efeitos permanecem os mesmos
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberEmail");
        if (savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail }));
            setRemember(true);
        }
    }, []);

    useEffect(() => {
        setFormData({ name: "", email: "", password: "" });
        setError(null);
    }, [tab]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const isLogin = tab === 'login';
        const endpoint = isLogin
            ? `${process.env.NEXT_PUBLIC_API_URL}/users/login`
            : `${process.env.NEXT_PUBLIC_API_URL}/users/signup`;

        const dataToSend = isLogin ? { email: formData.email, password: formData.password } : formData;

        try {
            const response = await axios.post(endpoint, dataToSend);

            if (isLogin) {
                const token = response.data?.token;
                if (token) {
                    await login(token);
                    if (remember) {
                        localStorage.setItem("rememberEmail", formData.email);
                    } else {
                        localStorage.removeItem("rememberEmail");
                    }
                    router.push('/bookshelf');
                } else {
                    setError("Erro ao autenticar. Token não retornado.");
                }
            } else {
                alert("Cadastro realizado com sucesso! Faça o login.");
                setTab("login");
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ error: string }>;
            setError(axiosError.response?.data?.error || `Erro ao ${isLogin ? 'fazer login' : 'criar conta'}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#fffaf7]">

            {/* Coluna Esquerda */}
            <div className="relative w-full h-[40vh] md:h-[35vh] lg:h-screen lg:w-3/5 xl:w-1/2 bg-[#4d3859] lg:p-10 flex flex-col justify-start pt-6 lg:pt-[20vh] lg:pr-40 items-center text-white text-center overflow-hidden">
                {/* Imagem de fundo */}
                <div className="absolute inset-0 z-0">
                    <Image src="/background.png" alt="Background" fill className="object-cover w-full h-full opacity-90" priority />
                    <div className="absolute inset-0 bg-[#4d3859]/70" />
                </div>

                {/* Container Interno */}
                <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                    {/* Logo ÚNICO com classes responsivas */}
                    <Image
                        src="/Audiomante (2).png"
                        alt="Audiomante Logo"
                        width={100} // Tamanho base (mobile)
                        height={100} // Tamanho base (mobile)
                        className="mx-auto mb-4 md:w-[150px] md:h-[150px] lg:mb-20 lg:w-[250px] lg:h-[250px]" // Tamanhos maiores para md e lg
                    />
                    <p className="text-xs lg:text-sm text-gray-300 max-w-xs mx-auto md:p-4">
                        Sua estante virtual de livros. Mergulhe em histórias, organize suas leituras e compartilhe suas paixões.
                    </p>
                </div>

                {/* Curva Desktop */}
                <div aria-hidden="true" className="hidden lg:block absolute top-0 right-0 h-full w-[200px] md:w-[260px] lg:w-[320px] z-20 pointer-events-none">
                    <svg viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-full w-full block">
                        <path d="M400,0 C320,300 -50,420 200,800 L400,800 L400,0 Z" fill="#fffaf7" />
                    </svg>
                </div>

                {/* Curva Mobile */}
                <div aria-hidden="true" className="block lg:hidden absolute bottom-0 left-0 w-full z-20 pointer-events-none">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[100px]">
                        <path fill="#fffaf7" d="M0,96 C480,256 960,64 1440,192 L1440,320 L0,320 Z" />
                    </svg>
                </div>
            </div>

            {/* Coluna Direita */}
            <div className="relative w-full flex-grow lg:w-2/5 xl:w-1/2 bg-[#fffaf7] p-8 md:p-12 lg:p-2 lg:mr-20 flex flex-col justify-center items-center">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-20 text-[#4d3859]">
                        {tab === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Input de Nome (usando o componente Input) */}
                        {tab === 'signup' && (
                            <Input
                                label="Nome"
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Digite seu nome"
                                required
                            />
                        )}

                        {/* Input de E-mail (usando o componente Input) */}
                        <Input
                            label="E-mail"
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="seuemail@exemplo.com"
                            required
                        />

                        {/* Input de Senha (usando o componente Input com showToggle) */}
                        <Input
                            label="Senha"
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            required
                            showToggle={true} // Habilita o botão de olho
                        />

                        {/* Lembrar de mim e Esqueceu senha */}
                        {tab === 'login' && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-gray-600">
                                    <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="mr-2 h-4 w-4 rounded border-gray-300 text-[#4d3859] focus:ring-[#4d3859]" /> Lembrar de mim
                                </label>
                                <Link href="#" className="text-[#433A5E] hover:underline font-medium">Esqueceu sua senha?</Link>
                            </div>
                        )}

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        {/* Botões de Ação */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 font-semibold rounded-lg shadow-md transition ${loading ? "bg-[#4d3859]/60 text-white cursor-not-allowed" : "bg-[#4d3859] hover:bg-[#3c2b46] text-white"}`}
                            >
                                {loading ? "Carregando..." : (tab === 'login' ? 'Entrar' : 'Cadastrar')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                                className="w-full py-3 px-4 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 text-[#4d3859] transition"
                            >
                                {tab === 'login' ? 'Criar conta' : 'Fazer login'}
                            </button>
                        </div>
                    </form>

                    {/* Divisor e Botão Google */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-[#d1c0d8]" />
                        <span className="mx-4 text-sm text-gray-500">ou</span>
                        <div className="flex-1 h-px bg-[#d1c0d8]" />
                    </div>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-[#c8b6d9]/70 rounded-lg bg-white/80 hover:bg-[#f4ecf7] shadow-sm transition-all"
                    >
                        <Image
                            src="/google-color-svgrepo-com.svg"
                            alt="Google logo"
                            width={20} // Equivalente a w-5
                            height={20} // Equivalente a h-5
                            className="mr-2" // Mantém a margem
                        />
                        <span className="font-medium text-[#4d3859]">Entrar com Google</span>
                    </button>
                </div>
            </div>

        </div>
    );
}