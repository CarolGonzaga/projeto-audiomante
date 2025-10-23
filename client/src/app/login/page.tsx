"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import axios, { AxiosError } from "axios"; // Corrigido para importar AxiosError
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

// Ícone do Google (mesmo de antes)
const GoogleIcon = () => <svg viewBox="0 0 48 48" className="w-5 h-5 mr-2"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>;


export default function AuthPage() {
    const [tab, setTab] = useState<"login" | "signup">("login");
    const { login } = useAuth();
    const router = useRouter(); // Adicionado para redirecionamento

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Efeito para buscar email salvo (se existir)
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberEmail");
        if (savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail }));
            setRemember(true);
        }
    }, []);

    // Efeito para limpar form ao trocar aba
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

        // Prepara os dados a serem enviados (remove 'name' se for login)
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
                    router.push('/bookshelf'); // Redireciona para estante após login
                } else {
                    setError("Erro ao autenticar. Token não retornado.");
                }
            } else {
                // Após signup, muda para a aba de login com mensagem
                alert("Cadastro realizado com sucesso! Faça o login.");
                setTab("login");
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ error: string }>; // Usa AxiosError
            setError(axiosError.response?.data?.error || `Erro ao ${isLogin ? 'fazer login' : 'criar conta'}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#fffaf7]">

            {/* Coluna Esquerda (Tema Audiomante) */}
            <div className="relative w-full h-[50vh] md:h-screen md:w-2/3 bg-[#4d3859] p-10 flex flex-col justify-center items-center text-white text-center overflow-hidden">
                {/* Imagem de fundo com overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/background.png"
                        alt="Background"
                        fill
                        className="object-cover w-full h-full opacity-60" // Ajuste a opacidade
                        priority
                    />
                    <div className="absolute inset-0 bg-[#4d3859]/70" /> {/* Overlay */}
                </div>

                {/* Conteúdo da coluna esquerda */}
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-8 font-display">Boas vindas ao Audiomante</h1>
                    <Image
                        src="/Audiomante (2).png" // Ou audiomante.png se preferir
                        alt="Audiomante Logo"
                        width={150}
                        height={150}
                        className="mx-auto mb-20"
                    />
                    <p className="text-sm text-gray-300 w-100">
                        Sua estante virtual de livros. Mergulhe em histórias, organize suas leituras e compartilhe suas paixões.
                    </p>
                </div>

                {/* ===== CURVA ESTILO "WAVE" (desktop) ===== */}
                <div
                    aria-hidden="true"
                    // Aparece SÓ em desktop
                    className="hidden md:block absolute top-0 right-0 h-full w-[200px] md:w-[260px] lg:w-[320px] z-30 pointer-events-none"
                >
                    <svg
                        viewBox="0 0 400 800"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="h-full w-full block"
                    >
                        <path
                            d="M400,0
                            C320,300 -200,420 200,800 
                            L400,800 L400,0 Z"
                            fill="#fffaf7"
                        />
                    </svg>
                </div>

                {/* Curva inferior estilo "wave" para mobile */}
                <div
                    aria-hidden="true"
                    className="block md:hidden absolute bottom-0 left-0 w-full z-20 pointer-events-none"
                >
                    <svg
                        viewBox="0 0 1440 320"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        className="w-full h-[140px]"
                    >
                        <path
                            fill="#fffaf7"
                            d="M0,96 C480,256 960,64 1440,192 L1440,320 L0,320 Z"
                        />
                    </svg>
                </div>

            </div>

            {/* Coluna Direita (Formulário) */}
            <div className="relative w-full flex-grow md:w-1/2 bg-[#fffaf7] p-8 md:p-12 flex flex-col justify-center shadow-lg overflow-hidden">
                <h2 className="text-3xl font-bold mb-6 text-[#4d3859]">
                    {tab === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input de Nome (só aparece no cadastro) */}
                    {tab === 'signup' && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-500 mb-1" htmlFor="name">Nome</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#4d3859] text-[#4d3859]"
                                placeholder="Digite seu nome"
                            />
                        </div>
                    )}

                    {/* Input de E-mail */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-500 mb-1" htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#4d3859] text-[#4d3859]"
                            placeholder="seuemail@exemplo.com"
                        />
                    </div>

                    {/* Input de Senha */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-500 mb-1" htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#4d3859] text-[#4d3859]"
                            placeholder="Digite sua senha"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 mt-1.5 text-gray-500 hover:text-[#4d3859]" // Ajuste fino do posicionamento
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    {/* Lembrar de mim e Esqueceu senha (só no login) */}
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
                            className={`w-full py-3 px-4 font-semibold rounded-lg shadow-md transition ${loading
                                ? "bg-[#4d3859]/60 text-white cursor-not-allowed"
                                : "bg-[#4d3859] hover:bg-[#3c2b46] text-white"
                                }`}
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
                    <GoogleIcon />
                    <span className="font-medium text-[#4d3859]">Entrar com Google</span>
                </button>
            </div>
        </div>
    );
}